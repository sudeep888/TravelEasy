// backend/src/controllers/baggageController.js
const { getDB } = require('../db/connection');
const cache = require('../utils/cache');

/**
 * Calculate baggage allowance and excess fees
 */
exports.calculateBaggage = async (req, res, next) => {
  try {
    const {
      airlineCode,
      routeType,
      cabinClass,
      passengerType = 'ADULT',
      cabinBags = [],
      checkedBags = []
    } = req.body;

    // Get baggage rules for the airline
    const rules = await getBaggageRules(airlineCode, routeType, cabinClass, passengerType);
    
    if (!rules) {
      return res.status(404).json({
        error: 'Rules not found',
        message: 'No baggage rules found for the specified criteria'
      });
    }

    // Calculate totals
    const cabinTotal = cabinBags.reduce((sum, bag) => sum + (bag.weight || 0), 0);
    const checkedTotal = checkedBags.reduce((sum, bag) => sum + (bag.weight || 0), 0);
    
    // Check allowances
    const cabinAllowance = rules.cabin_baggage_weight;
    const checkedAllowance = rules.checked_baggage_weight;
    
    const cabinExcess = Math.max(0, cabinTotal - cabinAllowance);
    const checkedExcess = Math.max(0, checkedTotal - checkedAllowance);
    
    // Calculate fees
    let excessFee = 0;
    if (rules.excess_fee_per_kg) {
      excessFee = (cabinExcess + checkedExcess) * rules.excess_fee_per_kg;
    }
    if (rules.excess_fee_flat && (cabinExcess > 0 || checkedExcess > 0)) {
      excessFee += rules.excess_fee_flat;
    }

    // Determine statuses
    const cabinStatus = cabinTotal <= cabinAllowance ? 'ALLOWED' : 
                       cabinTotal <= cabinAllowance * 1.5 ? 'EXTRA_FEE' : 'NOT_ALLOWED';
    
    const checkedStatus = checkedTotal <= checkedAllowance ? 'ALLOWED' : 
                         checkedTotal <= checkedAllowance * 2 ? 'EXTRA_FEE' : 'NOT_ALLOWED';

    const result = {
      airline: airlineCode,
      routeType,
      cabinClass,
      allowances: {
        cabin: {
          count: rules.cabin_baggage_count,
          weight: cabinAllowance,
          dimensions: rules.cabin_baggage_dimensions
        },
        checked: {
          count: rules.checked_baggage_count,
          weight: checkedAllowance,
          dimensions: rules.checked_baggage_size
        }
      },
      yourBags: {
        cabin: {
          count: cabinBags.length,
          totalWeight: cabinTotal,
          bags: cabinBags
        },
        checked: {
          count: checkedBags.length,
          totalWeight: checkedTotal,
          bags: checkedBags
        }
      },
      calculations: {
        cabinExcess,
        checkedExcess,
        totalExcess: cabinExcess + checkedExcess,
        excessFee,
        currency: rules.currency
      },
      status: {
        cabin: cabinStatus,
        checked: checkedStatus,
        overall: cabinStatus === 'NOT_ALLOWED' || checkedStatus === 'NOT_ALLOWED' ? 
                'NOT_ALLOWED' : cabinStatus === 'EXTRA_FEE' || checkedStatus === 'EXTRA_FEE' ? 
                'EXTRA_FEE' : 'ALLOWED'
      },
      notes: rules.notes,
      policyUrl: rules.policy_url,
      disclaimer: "These calculations are estimates. Actual fees may vary at the airport."
    };

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get baggage rules for an airline
 */
exports.getAirlineBaggageRules = async (req, res, next) => {
  try {
    const { airlineCode } = req.params;
    const { routeType, cabinClass } = req.query;
    
    const cacheKey = `baggage_rules_${airlineCode}_${routeType}_${cabinClass}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    const db = await getDB();
    let query = `
      SELECT br.*, a.name as airline_name, a.iata_code
      FROM baggage_rules br
      JOIN airlines a ON br.airline_id = a.id
      WHERE a.iata_code = $1 
        AND br.is_active = true
        AND (br.effective_to IS NULL OR br.effective_to >= CURRENT_DATE)
    `;
    
    const params = [airlineCode];
    let paramCount = 1;

    if (routeType) {
      paramCount++;
      query += ` AND br.route_type = $${paramCount}`;
      params.push(routeType.toUpperCase());
    }

    if (cabinClass) {
      paramCount++;
      query += ` AND br.cabin_class = $${paramCount}`;
      params.push(cabinClass.toUpperCase());
    }

    query += ' ORDER BY br.effective_from DESC';

    const result = await db.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'No baggage rules found for the specified criteria'
      });
    }

    cache.set(cacheKey, result.rows, 3600); // Cache for 1 hour
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to get baggage rules
 */
async function getBaggageRules(airlineCode, routeType, cabinClass, passengerType) {
  const db = await getDB();
  
  const query = `
    SELECT br.* 
    FROM baggage_rules br
    JOIN airlines a ON br.airline_id = a.id
    WHERE a.iata_code = $1 
      AND br.route_type = $2
      AND br.cabin_class = $3
      AND br.passenger_type = $4
      AND br.is_active = true
      AND (br.effective_to IS NULL OR br.effective_to >= CURRENT_DATE)
      AND br.effective_from <= CURRENT_DATE
    ORDER BY br.effective_from DESC
    LIMIT 1
  `;
  
  const result = await db.query(query, [
    airlineCode.toUpperCase(),
    routeType.toUpperCase(),
    cabinClass.toUpperCase(),
    passengerType.toUpperCase()
  ]);
  
  return result.rows[0];
}