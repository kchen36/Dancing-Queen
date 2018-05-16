import sqlite3

f = "app.db";
db = sqlite3.connect(f);
c = db.cursor();
c.execute('CREATE TABLE IF NOT EXISTS user (username STRING PRIMARY KEY, pass INTEGER);');
c.execute('CREATE TABLE IF NOT EXISTS team (name STRING, id INTEGER PRIMARY KEY);');
c.execute 
db.close();

#adduser(username, encrypt(password))
#change_password(username, encrypt(password))
#get_password(username)
