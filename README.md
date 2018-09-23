# hosts-accesses
##### A small web application on vue and bootstrap4 for storing and quickly searching for access to hosted hosting
###### (Небольшое веб-приложение на vue и bootstrap4 для хранения и быстрого поиска доступа к хостингу)

* данные хранятся в localstorage и доступны в том браузере, в который были импортированы или сохранены
* есть функционал экспорта в файл и импорт из файла (JSON)
* дополнительно транслитератор кирилических строк в url строку

[demo](https://webmachine.pp.ua/host-access/index.html) - данных нет (нужно создавать или импортировать)

```javascript
{
    "name":
    {
        "name": "...",
        "domain_url": "https://domain.com",
        "server": "",
        "user": "",
        "password": "",
        "name_db": "",
        "server_db": "localhost",
        "user_db": "",
        "password_db": "",
        "user_cms": "",
        "password_cms": "",
        "domain_host": "",
        "user_host": "",
        "password_host": ""
    },
    ...
}
```
