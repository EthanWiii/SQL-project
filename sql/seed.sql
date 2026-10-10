-- 所有名称与价格均为教学用途的虚构数据。
-- 脚本生成三只证券各 30 个工作日，共 90 条行情记录。

TRUNCATE TABLE daily_prices, securities RESTART IDENTITY CASCADE;

INSERT INTO securities (ticker, company_name, sector, currency)
VALUES
    ('NOVA', 'Nova Systems Ltd.', 'Technology', 'USD'),
    ('MAPL', 'Maple Bank Corp.', 'Financials', 'CAD'),
    ('GRNE', 'Green Energy Inc.', 'Energy', 'USD');

WITH trading_dates AS (
    SELECT
        calendar_date::DATE AS trade_date,
        (ROW_NUMBER() OVER (ORDER BY calendar_date) - 1)::INTEGER AS day_no
    FROM GENERATE_SERIES(
        DATE '2025-01-02',
        DATE '2025-02-28',
        INTERVAL '1 day'
    ) AS dates(calendar_date)
    WHERE EXTRACT(ISODOW FROM calendar_date) BETWEEN 1 AND 5
    ORDER BY calendar_date
    LIMIT 30
),
price_inputs AS (
    SELECT
        s.security_id,
        s.ticker,
        d.trade_date,
        d.day_no,
        CASE s.ticker
            WHEN 'NOVA' THEN 100.00 + d.day_no * 0.80
            WHEN 'MAPL' THEN 75.00 + d.day_no * 0.25
            WHEN 'GRNE' THEN 48.00 + d.day_no * 0.45
        END
        + CASE (d.day_no % 5)
            WHEN 0 THEN 0.00
            WHEN 1 THEN 1.20
            WHEN 2 THEN -0.60
            WHEN 3 THEN 0.90
            ELSE -0.30
          END AS close_value
    FROM securities AS s
    CROSS JOIN trading_dates AS d
)
INSERT INTO daily_prices (
    security_id,
    trade_date,
    open_price,
    high_price,
    low_price,
    close_price,
    volume
)
SELECT
    security_id,
    trade_date,
    ROUND((close_value - 0.40 + (day_no % 3) * 0.15)::NUMERIC, 2),
    ROUND((close_value + 1.10)::NUMERIC, 2),
    ROUND((close_value - 1.20)::NUMERIC, 2),
    ROUND(close_value::NUMERIC, 2),
    1000000
        + day_no * 25000
        + CASE ticker
            WHEN 'NOVA' THEN 500000
            WHEN 'MAPL' THEN 250000
            WHEN 'GRNE' THEN 100000
          END
FROM price_inputs
ORDER BY security_id, trade_date;
