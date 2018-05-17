import sqlite3
import hashlib

#creates all the tables only if they do not exist
f = "app.db"
db = sqlite3.connect(f)
c = db.cursor()
c.execute('CREATE TABLE IF NOT EXISTS users (username STRING PRIMARY KEY, password STRING);')
c.execute('CREATE TABLE IF NOT EXISTS teams (name STRING, id INTEGER PRIMARY KEY);')
c.execute('CREATE TABLE IF NOT EXIST members (id INTEGER PRIMARY KEY, leader BIT,member STRING, nickname STRING);')
c.execute('CREATE TABLE IF NOT EXIST permissions(id INTEGER PRIMARY KEY, user STRING);')
c.execute('CREATE TABLE IF NOT EXIST pieces(teamid INTEGER, pieceid INTEGER, song STRING, path STRING, name STRING, length INTEGER, width INTEGER, rows INTEGER, columns INTEGER, privacy BIT);')
c.execute('CREATE TABLE IF NOT EXIST formations(id INTEGER,formid INTEGER, dancer STRING, x INTEGER, y INTEGER, time, INTEGER, tag STRING);')
db.close()

def encrypt(pass):
    return hashlib.sha224(password).hexdigest()

def adduser(user, encrypt(password)):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    if getpass(user) is None:
	password = hashlib.sha224(password).hexdigest()
	c.execute('INSERT INTO users VALUES("%s", "%s", 100.0);' %(user, password))
        db.commit()
        db.close()
        return True
    db.close()
    return False

def getpass(user):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('SELECT password FROM users WHERE username= "%s";' %(user))
    result = c.fetchall()
    if result == []:
        db.close()
        return None
    else:
        db.close()
        return result[0][0]
    
def createteam(name,leader,nickname):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    
    
#changepass(username, encrypt(password))

