# lark-bridge-onboarding

> **Đây là bản fork của [zarazhangrui/lark-coding-agent-bridge](https://github.com/zarazhangrui/lark-coding-agent-bridge).** Toàn bộ công lao làm ra bridge thuộc về dự án gốc — phần máy móc bên dưới là của họ, không phải của bản fork này.
>
> Bản fork chỉ thêm một lớp: hướng dẫn cài đặt cho người không viết code. Nếu bạn dùng terminal thành thạo, **hãy dùng thẳng [bản gốc](https://github.com/zarazhangrui/lark-coding-agent-bridge)** — bạn không cần bản này.

**Nhắn tin cho Claude Code ngay trong Lark — kể cả khi bạn đang ở ngoài đường.**

[English](./README.en.md) · [中文](./README.zh.md)

---

## 1. Cái này là gì, và khác `lark-cli` chỗ nào?

Nếu bạn từng dùng `lark-cli`, đây là chỗ dễ nhầm nhất. Hai thứ **ngược chiều nhau**:

| | **lark-cli** | **Bridge** (cái này) |
|---|---|---|
| Bạn ngồi ở đâu | **Trước máy tính**, gõ terminal | **Trong Lark** — điện thoại cũng được |
| Lark đóng vai gì | **Đối tượng làm việc** — Claude vươn *ra* sửa Doc, Base, gửi tin | **Bàn phím từ xa** — Lark đẩy lệnh *vào* máy bạn |
| Máy tính đóng vai gì | Nơi bạn đang ngồi | **Nơi Claude chạy — phải luôn bật** |

Một câu cho dễ nhớ:

> **lark-cli** cho Claude *làm việc trên Lark*.
> **Bridge** cho bạn *điều khiển Claude từ Lark*.

Vì ngược chiều nhau nên chúng là **hai ứng dụng Lark khác nhau**. Cài cái này không ảnh hưởng cái kia, và bạn không cần bỏ cái nào cả.

**Hai cái dùng chung thì rất mạnh:** bạn nhắn từ điện thoại → bridge đánh thức Claude ở nhà → Claude dùng lark-cli sửa Base giúp bạn.

## 2. ⚠️ Đọc cái này trước khi cài

**Bot chỉ trả lời khi máy tính của bạn đang bật và không ngủ.**

Đây không phải lỗi — mà là chủ ý thiết kế. Bridge **không phải dịch vụ đám mây**: code và file của bạn không rời khỏi máy, token dùng tài khoản của chính bạn, dữ liệu nằm ở local. Cái giá phải trả là **máy phải sống**.

Cụ thể, ba trường hợp đều làm bot ngừng trả lời:

- **Tắt máy** → bot chết.
- **Máy ngủ / gập nắp MacBook** → bot cũng chết. Đây là cái hay bị bất ngờ nhất.
- **Mất mạng** → tạm ngừng, nhưng bridge tự kết nối lại khi có mạng.

Tin nhắn gửi lúc máy tắt sẽ **không được xử lý sau** — bật máy lên phải nhắn lại.

**Cách xử lý:**

1. Dùng máy để bàn cắm điện 24/7 (đơn giản nhất, đúng tinh thần nhất).
2. Nếu dùng laptop: chỉnh máy không ngủ khi cắm sạc. Lưu ý **gập nắp là vẫn ngủ**, trừ khi có màn hình ngoài.
3. Chạy trên VPS cũng được — nhưng khi đó code của bạn phải nằm trên VPS, và nó không còn là "điều khiển máy của tôi" nữa.

## 3. Cần chuẩn bị gì

| Thứ cần | Bắt buộc? | Thiếu thì sao |
|---|---|---|
| **Node.js ≥ 20.12** | ✅ Bắt buộc | Không cài được |
| **Claude Code (`claude`)** | ✅ **Bắt buộc** | **Bot không chạy** — đây là bộ não |
| **lark-cli** | ⚠️ Nên có | Bot vẫn chạy, nhưng **không đụng được vào Lark** (không gửi thẻ, không sửa Doc/Base) |

### Claude Code — bắt buộc

Bridge không tự nghĩ. Nó chỉ đánh thức `claude` **đã cài sẵn trên máy bạn**. Kiểm tra:

```bash
claude --version
```

Nếu báo `command not found`:

```bash
npm i -g @anthropic-ai/claude-code
claude auth login
```

> **Lưu ý:** cài app **Claude cho máy tính** (Claude.app) là **chưa đủ** — app đó không kèm lệnh `claude`. Phải cài riêng bằng lệnh trên.

### lark-cli — nên cài trước

Bridge có tự cài lark-cli, **nhưng chỉ khi bạn chạy nó ở chế độ tương tác**. Nếu bạn khởi động dạng dịch vụ nền trước, nó **lặng lẽ bỏ qua** và bạn sẽ ngồi thắc mắc sao bot không đụng được vào Lark.

Cài trước thì tránh hẳn được cái bẫy đó:

👉 **[github.com/nixthinh-bit/lark-cli-onboarding](https://github.com/nixthinh-bit/lark-cli-onboarding)** — cài lark-cli, skill, và tự động gia hạn token.

## 4. Cài bridge — một lệnh

```bash
curl -fsSL https://raw.githubusercontent.com/nixthinh-bit/lark-bridge-onboarding/main/install.sh | bash
```

Lệnh này sẽ: kiểm tra Node.js → kiểm tra Claude Code (thiếu thì **hỏi** bạn có muốn cài không) → nhắc về lark-cli nếu chưa có → cài bridge → chỉ bạn bước tiếp theo. Nó **không bao giờ** tự cài Node.js hay lark-cli mà không hỏi.

Muốn giao diện cài bằng tiếng Anh: thêm `LARK_CHANNEL_LANG=en` vào trước `curl`.

> ⚠️ **Nếu bạn đã cài bản gốc của Zara**: lệnh trên **đè lên bản đó**, vì hai bản dùng chung tên lệnh `lark-channel-bridge`. Đây là bản thay thế drop-in — mọi lệnh của bản gốc vẫn chạy y hệt. Muốn quay về bản gốc: `npm i -g lark-channel-bridge`. Chưa từng nghe tới bản gốc thì cứ bỏ qua đoạn này.

<details>
<summary>Không thích <code>curl | bash</code>? Cài tay như sau</summary>

```bash
git clone https://github.com/nixthinh-bit/lark-bridge-onboarding
cd lark-bridge-onboarding
npm install     # cài thư viện, đồng thời tự biên dịch
npm i -g .      # cài toàn cục
```

⚠️ Cách này liên kết tới chính thư mục vừa clone, nên **đừng xoá hay di chuyển nó** sau khi cài.

Và **đừng dùng `npm i -g github:nixthinh-bit/lark-bridge-onboarding`** — nghe hợp lý nhưng **không chạy**: npm sẽ clone rồi cố biên dịch, nhưng ở chế độ `-g` nó không đặt được công cụ biên dịch đúng chỗ, kết quả là `tsup: command not found`. Đây chính là lý do `install.sh` tồn tại.

</details>

## 5. Chạy lần đầu — quét QR là xong

```bash
lark-channel-bridge run
```

**Bạn KHÔNG cần vào trang dành cho lập trình viên. KHÔNG cần tự tạo ứng dụng. KHÔNG cần copy App ID hay App Secret.** Trình hướng dẫn lo hết:

1. Terminal hiện ra một **mã QR**.
2. Mở **app Lark trên điện thoại**, quét mã đó.
3. Ứng dụng Lark được **tạo tự động**, quyền cũng được điền sẵn.
4. Xong. Cấu hình lưu vào `~/.lark-channel/config.json`.

Người quét mã QR **tự động trở thành chủ ứng dụng**, nên bạn nhắn được cho bot ngay từ tin đầu tiên mà không phải chỉnh gì.

Muốn giao diện tiếng Việt (nếu máy bạn đang để tiếng Anh):

```bash
lark-channel-bridge --lang vi run
```

> **Dùng Lark bản quốc tế?** Trình hướng dẫn tự nhận ra và chuyển sang `larksuite.com`, bạn không phải làm gì.
>
> **Công ty bạn chặn tạo ứng dụng?** Một số tổ chức bắt quản trị viên duyệt trước. Nếu bị từ chối, hãy nhờ admin Lark của công ty.

Chạy nền để khỏi phải mở terminal suốt:

```bash
lark-channel-bridge start     # bật chạy nền
lark-channel-bridge status    # xem còn sống không
lark-channel-bridge stop      # tắt
```

## 6. Chọn model — và giữ gói token 5 giờ

Trong Lark, nhắn cho bot:

```
/config
```

Thẻ hiện ra có ô chọn model: **Opus 4.8 / 4.7, Sonnet 5 / 4.6, Haiku 4.5, Opus Plan**.

**Điều quan trọng cần hiểu về token:** bridge **không tự tiêu token**. Nhưng mỗi tin nhắn bạn gửi qua Lark = **một lượt Claude Code chạy thật** trên máy bạn.

- Nếu `claude` đăng nhập bằng **gói thuê bao (Pro/Max)** → mỗi tin **ăn vào đúng cửa sổ 5 giờ** như khi bạn gõ trong terminal. Không có hạn mức riêng.
- Nếu đăng nhập bằng **API key** → tính tiền theo token, **không có** cửa sổ 5 giờ.

⚠️ Vì giờ bắn lệnh từ điện thoại quá dễ, **bạn sẽ đốt hết cửa sổ 5 giờ nhanh hơn bạn tưởng**. Mẹo: việc nhẹ thì hạ xuống Haiku, để dành Opus cho việc thật sự khó.

## 7. 🔒 Siết quyền — làm ngay, đừng để sau

Mặc định đã khá an toàn: **chỉ mình bạn** (người quét mã QR) dùng được bot.

Nhưng có một cái bẫy:

> **Đừng gõ `/invite group`** trừ khi bạn thật sự hiểu hậu quả.
>
> Khi một nhóm được cho phép, **MỌI thành viên trong nhóm đó** đều ra lệnh được cho Claude trên máy bạn — đọc file, sửa file, chạy lệnh.

Nên cho từng người một:

```
/invite user @Tên người đó
```

Và cân nhắc hạ quyền của bot. Mặc định là `full` (Claude làm gì cũng được trên máy bạn):

| Mức | Claude được làm gì |
|---|---|
| `full` | **Mọi thứ** — đọc, sửa, xoá, chạy lệnh (mặc định) |
| `workspace` | Chỉ sửa trong thư mục làm việc |
| `read-only` | Chỉ đọc, không sửa gì |

## Gặp lỗi?

| Terminal báo | Nghĩa là | Sửa sao |
|---|---|---|
| `Không tìm thấy Claude Code trên máy này` | Chưa cài `claude` (hoặc mới chỉ cài Claude.app) | `npm i -g @anthropic-ai/claude-code` |
| `Chưa có cấu hình…` | Chưa chạy lần đầu | Chạy `lark-channel-bridge run` trong terminal |
| Bot không trả lời | Máy ngủ / tắt / daemon chết | `lark-channel-bridge status` |
| Bot chạy nhưng không đụng được Lark | Thiếu lark-cli | Xem [mục 3](#3-cần-chuẩn-bị-gì) |

Xem thêm: `lark-channel-bridge --help`, và [tài liệu đầy đủ (tiếng Anh)](./README.en.md).

## Bản fork này thêm gì

| Phần | Của ai |
|---|---|
| Toàn bộ engine — kênh Lark, thẻ, adapter Claude/Codex, wizard QR, phiên, phân quyền | **Dự án gốc**: [zarazhangrui/lark-coding-agent-bridge](https://github.com/zarazhangrui/lark-coding-agent-bridge) |
| Hướng dẫn song ngữ, dịch phần cài đặt sang Việt/Anh | Bản fork này |

**Bị lỗi ở bản thân bridge → báo về [dự án gốc](https://github.com/zarazhangrui/lark-coding-agent-bridge/issues).** Chỉ mở issue ở repo này nếu lỗi nằm ở phần hướng dẫn hoặc bản dịch.

> **Chưa xong:** giao diện **trong Lark** (thẻ `/config`, `/help`…) **vẫn còn tiếng Trung** — đang làm. Hiện tại chỉ phần cài đặt trong terminal là đã có tiếng Việt.

## Giấy phép

[MIT](./LICENSE) — giống bản gốc. Dòng bản quyền gốc được giữ nguyên vẹn.
