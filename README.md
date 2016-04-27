# nodejscomments

## Requrements 
- Mongodb 3.2.5
- nodemon (Для node run dev)

## Задачи 

1) Должен быть реализован REST API.

ok

Postman config для отправки запросов из браузера https://github.com/snicksnk/nodejscomments/blob/master/requests.json

2) Сделать методы по регистрации и авторизации через логин с паролем.
- Регистрация https://github.com/snicksnk/nodejscomments/blob/master/src/routes/user.js#L7-L18
- Авторизация (JWT) https://github.com/snicksnk/nodejscomments/blob/master/src/routes/user.js#L26-L35

3) Методы для создания и получения списка комментариев.
- Создание коммента https://github.com/snicksnk/nodejscomments/blob/master/src/routes/comment.js#L8-L23
- Путь храним в виде Array of Ancestors https://docs.mongodb.org/manual/tutorial/model-tree-structures-with-ancestors-array/

- Получение дерева https://github.com/snicksnk/nodejscomments/blob/master/src/routes/comment.js#L8-L23
- Построение дерева происходит тут (За один проход o(N)) https://github.com/snicksnk/nodejscomments/blob/master/src/service/comment.js#L71-L116


4) Метод, который рассчитывает максимальный уровень вложенности в дереве комментариев. Уровень комментария в модели хранить нельзя, метод должен рассчитывать его.
- Вычисляем с помощью $aggregaеe  https://github.com/snicksnk/nodejscomments/blob/master/src/service/comment.js#L47-L69

5) Метод, который будет возвращать массив пользователей с количеством их комментариев и этот массив должен быть отсортирован по убыванию количества комментариев (пользователь с наибольшим количеством комментариев должен быть всегда сверху). Желательно реализовать одним запросом к БД.
- Храним в модели пользователя, апдейтим при написании комента https://github.com/snicksnk/nodejscomments/blob/master/src/service/comment.js#L47-L69
