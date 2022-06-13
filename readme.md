<!-- Chạy chương trình -->
Mở folder bằng visual studio code.
Cài đặt extension live server.
Chuột phải vào file index.html -> Open with live server.

<!-- Lỗi sai đường dẫn -->
Vì mỗi máy chạy live server thì sẽ chạy trên đường dẫn và port khác nhau nên khi chạy hãy xem lại đường dẫn của local. Nếu sai thì tiến hành fix như sau:

Mở file junction.js (folder js), kéo xuống cuối cùng có hàm getPathName()
Thay đổi domain có sẵn thành domain trên trình duyệt của mình 

Vd: Chạy local với domain http://127.0.0.1:8080/ thì thay đổi từ http://127.0.0.1:5500/ thành http://127.0.0.1:8080/ (phải có dấu "/" ở cuối)

Save và F5 lại trình duyệt.