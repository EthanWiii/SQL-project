-- Level 3: Subquery / CTE / Daily Return

-- 3.1 Subquery：找出收盘价高于各证券自身平均值的日期
SELECT
    s.ticker,
    p.trade_date,
    p.close_price
FROM daily_prices AS p
JOIN securities AS s
    ON s.security_id = p.security_id
WHERE p.close_price > (
    SELECT AVG(peer.close_price)
    FROM daily_prices AS peer
    WHERE peer.security_id = p.security_id
)
ORDER BY s.ticker, p.trade_date;

-- 3.2 CTE + 相关子查询：先取前一日价格，再计算简单日收益率
WITH prices_with_previous_close AS (
    SELECT
        p.security_id,
        p.trade_date,
        p.close_price,
        (
            SELECT previous.close_price
            FROM daily_prices AS previous
            WHERE previous.security_id = p.security_id
              AND previous.trade_date < p.trade_date
            ORDER BY previous.trade_date DESC
            LIMIT 1
        ) AS previous_close
    FROM daily_prices AS p
),
daily_returns AS (
    SELECT
        security_id,
        trade_date,
        close_price,
        previous_close,
        (close_price / previous_close) - 1 AS daily_return
    FROM prices_with_previous_close
    WHERE previous_close IS NOT NULL
)
SELECT
    s.ticker,
    r.trade_date,
    r.close_price,
    r.previous_close,
    ROUND((r.daily_return * 100)::NUMERIC, 4) AS daily_return_pct
FROM daily_returns AS r
JOIN securities AS s
    ON s.security_id = r.security_id
ORDER BY s.ticker, r.trade_date;

-- 3.3 CTE：找出首尾日期并计算整个区间的累计收益率
WITH date_bounds AS (
    SELECT
        security_id,
        MIN(trade_date) AS first_date,
        MAX(trade_date) AS latest_date
    FROM daily_prices
    GROUP BY security_id
)
SELECT
    s.ticker,
    b.latest_date,
    first_price.close_price AS first_close,
    latest_price.close_price AS latest_close,
    ROUND((
        ((latest_price.close_price / first_price.close_price) - 1) * 100
    )::NUMERIC, 2)
        AS cumulative_return_pct
FROM date_bounds AS b
JOIN securities AS s
    ON s.security_id = b.security_id
JOIN daily_prices AS first_price
    ON first_price.security_id = b.security_id
   AND first_price.trade_date = b.first_date
JOIN daily_prices AS latest_price
    ON latest_price.security_id = b.security_id
   AND latest_price.trade_date = b.latest_date
ORDER BY cumulative_return_pct DESC;
