# MarketScope Frontend

这是 PostgreSQL 金融市场项目的静态行情分析前端。页面使用与 `sql/seed.sql` 相同的虚构数据生成规则，因此无需后端即可预览完整交互。

## 功能

- 切换 NOVA、MAPL、GRNE 三只虚构证券
- 查看最新价格、累计收益率、MA20、5 日动量与 20 日年化波动率
- 交互式收盘价与 MA20 走势图
- 日收益率和成交量图
- 最近 10 个交易日 OHLCV 行情表
- 日期搜索、明暗主题和响应式布局

## 本地运行

在 `frontend` 目录执行：

```bash
python3 -m http.server 8080
```

然后打开 [http://localhost:8080](http://localhost:8080)。

页面没有第三方依赖，也可以直接双击 `index.html` 打开。

## 数据说明

所有公司、ticker 和行情均为虚构内容，仅用于 SQL 与前端开发教学，不构成投资建议。真实项目可以将 `app.js` 中的本地数据替换为 PostgreSQL API 返回的数据。
