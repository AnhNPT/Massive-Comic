function alertResponseError(data) {
    let json = JSON.parse(data.responseText);
    var error = json.errors[0].message;
    
    if (error == 'Field "email" has to be unique.') {
        error = 'Email đã được sử dụng để đăng ký.';
    }
    alertError(error);
}

function alertError(string) {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hãy kiểm tra lại thông tin!",
    })
}

function alertRegisterSuccess(handle) {
    Swal.fire({
        title: 'Đăng ký thành công',
        text: "Đăng nhập ngay để theo dõi những đầu truyện mới nhất",
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đăng nhập'
        })
    .then((result) => {
        if (result.isConfirmed) {
            handle();
        }
    });
}