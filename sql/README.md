# PostgreSQL 金融市场 SQL 学习项目

这是一个适合放在 GitHub Portfolio 中的入门项目。项目使用 PostgreSQL 和虚构金融市场数据，从基础查询逐步学习到量化分析常用的窗口函数。

> 数据声明：项目中的公司、ticker 和价格全部为虚构内容，仅用于 SQL 学习，不构成投资建议。

## 项目内容

```text
.
├── schema.sql                       # 数据表、约束和索引
├── seed.sql                         # 10 只证券 × 30 个交易日
├── level_1_basics.sql               # SELECT / WHERE / ORDER BY
├── level_2_joins_aggregations.sql   # JOIN / GROUP BY / HAVING
├── level_3_returns.sql              # Subquery / CTE / 收益率
├── level_4_window_functions.sql     # MA20 / Momentum / Volatility
└── .gitignore
```

数据模型包含两张表：

- `securities`：ticker、公司名称、行业、币种等证券主数据。
- `daily_prices`：开盘价、最高价、最低价、收盘价和成交量。

两张表通过 `security_id` 建立一对多关系，并使用唯一约束防止同一证券在同一天出现重复行情。

## 学习路线

| Level | 主要知识 | 完成后能够做什么 |
|---|---|---|
| 1 | `SELECT`、`WHERE`、`ORDER BY`、`LIMIT` | 筛选价格、日期和成交量 |
| 2 | `JOIN`、`GROUP BY`、`HAVING` | 合并证券与行情数据，计算汇总指标 |
| 3 | Subquery、CTE、相关子查询 | 计算日收益率与累计收益率 |
| 4 | Window Functions | 计算 MA20、5 日动量和 20 日滚动波动率 |

## 运行要求

- PostgreSQL 14 或更高版本
- PostgreSQL 命令行工具 `psql`

## 运行步骤

先创建数据库：

```bash
createdb global_markets
```

然后在项目目录中依次运行：

```bash
psql -d global_markets -f schema.sql
psql -d global_markets -f seed.sql
```

确认数据已正确导入：

```bash
psql -d global_markets -c "SELECT COUNT(*) FROM securities;"
psql -d global_markets -c "SELECT COUNT(*) FROM daily_prices;"
```

预期分别得到 `10` 和 `300`。

按顺序运行练习：

```bash
psql -d global_markets -f level_1_basics.sql
psql -d global_markets -f level_2_joins_aggregations.sql
psql -d global_markets -f level_3_returns.sql
psql -d global_markets -f level_4_window_functions.sql
```

如果数据库用户名不是当前系统用户名，可以增加 `-U your_username`；如果数据库运行在其他主机，可以增加 `-h hostname`。

## 查询示例

下面的查询计算每只证券每天的 20 日移动平均线。`ROWS BETWEEN 19 PRECEDING AND CURRENT ROW` 表示当前行加前面 19 行，共 20 个观测值。

```sql
SELECT
    security_id,
    trade_date,
    close_price,
    ROUND(
        AVG(close_price) OVER (
            PARTITION BY security_id
            ORDER BY trade_date
            ROWS BETWEEN 19 PRECEDING AND CURRENT ROW
        ),
        2
    ) AS ma20
FROM daily_prices
ORDER BY security_id, trade_date;
```

## Level 4 指标定义

**MA20（20 日移动平均）**

```text
MA20 = 最近 20 个交易日收盘价的平均值
```

**5 日 Momentum（动量）**

```text
Momentum = (今日收盘价 / 5 个交易日前收盘价 - 1) × 100%
```

**20 日 Rolling Volatility（滚动波动率）**

```text
Rolling Volatility = 最近 20 个日收益率的样本标准差 × √252
```

这里使用 `252` 作为一年中常用的交易日数量，因此输出为年化波动率。

## 预期输出

运行 Level 2 的区间统计查询时，每只证券应有 30 条记录：

```text
 ticker | trading_days | avg_close | min_close | max_close
--------+--------------+-----------+-----------+----------
 NOVA   |           30 |    111.84 |    100.00 |    123.30
 MAPL   |           30 |     78.87 |     74.90 |     82.90
 GRNE   |           30 |     54.77 |     48.00 |     61.50
```

运行 Level 3 的日收益率查询时，每只证券的第一天没有前一日价格，因此不会出现在结果中。预期共返回 `10 × 29 = 290` 行。

运行 Level 4 的第一个查询时，20 个日收益率需要 21 个收盘价观测值，因此只有第 21 个观测值及之后的记录才会显示。预期共返回 `10 × 10 = 100` 行。

最后一个查询只显示每只证券在 `2025-02-12` 的最新指标，预期返回 10 行。以下为其中三行：

```text
 ticker | trade_date | close_price | ma20   | momentum_5d_pct | rolling_volatility_20d_pct
--------+------------+-------------+--------+-----------------+---------------------------
 GRNE   | 2025-02-12 |       60.75 |  57.02 |            3.85 |                     37.51
 MAPL   | 2025-02-12 |       81.95 |  80.12 |            1.55 |                     26.49
 NOVA   | 2025-02-12 |      122.90 | 115.84 |            3.36 |                     18.47
```

这种每只证券一行的结果很适合继续接入 Streamlit 或 Tableau Dashboard。

## 可以继续扩展的方向

- 导入真实但经过许可的股票、ETF、外汇或利率数据。
- 增加 50 日与 200 日移动平均线，以及均线交叉信号。
- 添加资产之间的相关性和投资组合风险分析。
- 用 Python 自动更新数据库，并制作 Streamlit Dashboard。
- 使用 Docker Compose 让别人一条命令启动 PostgreSQL。
