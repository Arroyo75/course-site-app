Aplikacja Platforma E-learningowa z kursami

Technologie
Frontend - React, Vite.js, Chakra-UI
Backend - Node.js Express.js Multer
Baza Danych - MongoDb
Storage - Aws S3

Jak uruchomić:

Uruchomienie lokalne:
W celu uruchomienia projektu wymagane jest konto na aws s3 oraz atlas mongodb albo odpowiednie zmienne środowiskowe.
Po sklonowaniu repozytorium i otworzeniu go w Visual Studio Code, komenda:
	npm run build
zainstaluje wymagane zależności.
Przed uruchomieniem serwera należy stworzyć plik .env z następującymi zmiennymi środowiskowymi:
	PORT - port na którym uruchomi się serwer (domyślnie 5000)
	MONGO_URI - połączenie z bazą danych mongo
	JWT_SECRET - sekret json web token, używany do autentykacji
	AWS_ACCESS_KEY_ID - klucze API do AWS
	AWS_SECRET_ACCESS_KEY
	AWS_REGION - region aws
	AWS_BUCKET_NAME - nazwa s3 bucket
Następnie można uruchomić serwer:
	npm run start

Użytkownik może utworzyć konto i się na nie zalogować. Przeglądać kursy oraz ich szczegóły, oraz szukać kursy po tytule, autorze czy opisie. W szczegółach kursu może zobaczyć wykłady kursu.
Zalogowany użytkownik może tworzyć swoje kursy oraz przeglądać na jakie kursy się zapisał, bądź jakie stworzył oraz zapisać się na kurs.
Jako autor może usuwać, edytować kursy. Posiada możliwość również tworzenia własnych wykładów, poprzez wrzucanie plików pdf na aws s3, edytowania ich oraz usuwania.
Zapisany na kurs użytkownik może pobrać pdfa związanego z wykładem.
Oprócz tego została zapewniona responsywność.
