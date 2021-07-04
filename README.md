# hackaton_2021
настройка npm install

запуск npm start

для работы поиска необходимо скачать файлы с гугл диска https://drive.google.com/drive/folders/1qdkjreQk_DEH4HggmZfE0JIDq11jzZN3?usp=sharing
создать папку fond в корне проекта и в нее добавит файлы из гугл диска, чтоб получилась такая же структура как на скриншоте
![image](https://user-images.githubusercontent.com/61736688/124379994-ccf8ce00-dcd3-11eb-95f8-c8796443ddb2.png)

# Создание базы данных:
в папке Collections лежат дампы коллекций MongoDB, их необходимо импортировать в базу
в локально запущенной MongoDb необзходимо создать базу данных с названием hackaton_2021

Инструкция по настройке базы данных - https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-20-04-ru

Команды для импорта данных:

mongoimport --db hackaton_2021 --collection epmk --file epmk.json

mongoimport --db hackaton_2021 --collection users --file users.json

mongoimport --db hackaton_2021 --collection name_index --file name_index.json

mongoimport --db hackaton_2021 --collection subject_index --file subject_index.json

пример как импортирвать в локальную базу (https://www.digitalocean.com/community/tutorials/how-to-import-and-export-a-mongodb-database-on-ubuntu-20-04-ru)
