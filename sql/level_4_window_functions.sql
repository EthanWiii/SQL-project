-- Level 4: Window Functions
-- 指标：MA20、5 日动量、20 日年化滚动波动率

WITH return_series AS (
    SELECT
        p.security_id,
        p.trade_date,
        p.close_price,
        LAG(p.close_price) OVER (
            PARTITION BY p.security_id
            ORDER BY p.trade_date
        ) AS previous_close
    FROM daily_prices AS p
),
market_indicators AS (
    SELECT
        security_id,
        trade_date,
        close_price,
        ROW_NUMBER() OVER (
            PARTITION BY security_id
            ORDER BY trade_date
        ) AS observations,
        AVG(close_price) OVER (
            PARTITION BY security_id
            ORDER BY trade_date
            ROWS BETWEEN 19 PRECEDING AND CURRENT ROW
        ) AS ma20,
        LAG(close_price, 5) OVER (
            PARTITION BY security_id
            ORDER BY trade_date
        ) AS close_5_days_ago,
        STDDEV_SAMP((close_price / previous_close) - 1) OVER (
            PARTITION BY security_id
            ORDER BY trade_date
            ROWS BETWEEN 19 PRECEDING AND CURRENT ROW
        ) * SQRT(252) AS rolling_volatility_20d
    FROM return_series
)
SELECT
    s.ticker,
    i.trade_date,
    i.close_price,
    ROUND(i.ma20, 2) AS ma20,
    ROUND((((i.close_price / i.close_5_days_ago) - 1) * 100)::NUMERIC, 2)
        AS momentum_5d_pct,
    ROUND((i.rolling_volatility_20d * 100)::NUMERIC, 2)
        AS rolling_volatility_20d_pct
FROM market_indicators AS i
JOIN securities AS s
    ON s.security_id = i.security_id
-- 20 个日收益率需要 21 个收盘价观测值。
WHERE i.observations >= 21
ORDER BY s.ticker, i.trade_date;

-- 4.2 每只证券只保留最新一天的指标，可用于 Dashboard
WITH return_series AS (
    SELECT
        security_id,
        trade_date,
        close_price,
        LAG(close_price) OVER (
            PARTITION BY security_id
            ORDER BY trade_date
        ) AS previous_close
    FROM daily_prices
),
indicators AS (
    SELECT
        security_id,
        trade_date,
        close_price,
        AVG(close_price) OVER (
            PARTITION BY security_id
            ORDER BY trade_date
            ROWS BETWEEN 19 PRECEDING AND CURRENT ROW
        ) AS ma20,
        LAG(close_price, 5) OVER (
            PARTITION BY security_id
            ORDER BY trade_date
        ) AS close_5_days_ago,
        STDDEV_SAMP((close_price / previous_close) - 1) OVER (
            PARTITION BY security_id
            ORDER BY trade_date
            ROWS BETWEEN 19 PRECEDING AND CURRENT ROW
        ) * SQRT(252) AS rolling_volatility_20d,
        ROW_NUMBER() OVER (
            PARTITION BY security_id
            ORDER BY trade_date DESC
        ) AS latest_rank
    FROM return_series
)
SELECT
    s.ticker,
    i.trade_date,
    i.close_price,
    ROUND(i.ma20, 2) AS ma20,
    ROUND((((i.close_price / i.close_5_days_ago) - 1) * 100)::NUMERIC, 2)
        AS momentum_5d_pct,
    ROUND((i.rolling_volatility_20d * 100)::NUMERIC, 2)
        AS rolling_volatility_20d_pct
FROM indicators AS i
JOIN securities AS s
    ON s.security_id = i.security_id
WHERE i.latest_rank = 1
ORDER BY s.ticker;
