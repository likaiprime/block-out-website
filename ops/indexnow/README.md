# blockout.cc IndexNow 维护

配置与提交脚本属于这个站点。现有网站源码：`C:\Users\Administrator\Documents\Codex\2026-10-09\plausible-plausible-https-p-070122-xyz\work\blockout-production`。

- 规范主机：blockout.cc（不要混用 apex 与 www）。
- 公开验证文件：https://blockout.cc/indexnow.txt
- 验证 key 是公开所有权标识，不是账号凭据。保留现有 key，不要每次发布轮换。
- 复用网站自身 public 目录中已有的验证文件；网站发布时确保文件仍被复制到实际静态目录。
- 公开 URL 来源：https://blockout.cc/sitemap.xml；脚本递归处理 sitemap index。

## 检查和提交

在本目录执行（Node 20+）：

```powershell
node submit.mjs
node submit.mjs --submit
node submit.mjs --submit https://blockout.cc/changed-public-page
```

不加 --submit 只检查。发布公开页面后显式提交变更 URL；不要每次重复全量推送。删除页面时可用官方接口通知删除 URL（维护脚本的页面检查会阻止 404，需按官方文档单独处理）。脚本验证 key 的 HTTP 200、纯文本和精确内容，拒绝 HTML 回退响应、其他主机、私有路径、robots 禁止路径，抽查 noindex/HTTP/重定向，并按最多 10,000 URL 分批。保留 last-submission.json 和 last-urls.json 作为回执。

HTTP 200 表示接口收到；202 表示已收到但 key 验证待处理，均不等于已收录。不需要同时向各搜索引擎重复发送，参与引擎共享通知。发布验证文件不等于自动提交：继续使用以上脚本或现有 CI 的显式发布后步骤，未添加定时任务。

文档：[IndexNow 协议](https://www.indexnow.org/documentation)。
