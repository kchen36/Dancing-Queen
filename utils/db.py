import sqlite3
import hashlib

#creates all the tables only if they do not exist
f = "app.db"
db = sqlite3.connect(f)
c = db.cursor()
c.execute('CREATE TABLE IF NOT EXISTS users (username STRING PRIMARY KEY, password STRING);')
c.execute('CREATE TABLE IF NOT EXISTS teams (name STRING, id INTEGER PRIMARY KEY);')
c.execute('CREATE TABLE IF NOT EXISTS members (id INTEGER PRIMARY KEY, leader BIT,name STRING, nickname STRING);')
c.execute('CREATE TABLE IF NOT EXISTS permissions(id INTEGER PRIMARY KEY, user STRING);')
c.execute('CREATE TABLE IF NOT EXISTS pieces(teamid INTEGER, pieceid INTEGER, song STRING, path STRING, name STRING, length INTEGER, width INTEGER, rows INTEGER, columns INTEGER, privacy BIT);')
c.execute('CREATE TABLE IF NOT EXISTS formations(id INTEGER,formid INTEGER, dancer STRING, x INTEGER, y INTEGER, time, INTEGER, tag STRING);')
db.close()

#hash password
def encrypt(password):
    return hashlib.sha224(password).hexdigest()

#adds user to users table and returns true if sucessful else returns false
def adduser(user, password):
    password = encrypt(password)
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

#returns the password of a user if the username exist
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

#creates a team and the creator is the leader
def createteam(name,leader,nickname):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('SELECT MAX(id) FROM teams;')
    result = c.fetchall()
    number = result[0][0]
    c.execute('INSERT INTO teams VALUES("%s", "%d", );' %(name, number))
    c.execute('INSERT INTO members VALUES("%d", 1, "%s", "%s");' %(number, name, nickname))
    db.commit()
    db.close()

#adds a person to a team and adds a nickname
def addmember(teamid, name, nick):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('INSERT INTO members VALUES("%d", 0, "%s", "%s");' %(teamid, name, nickname))
    db.commit()
    db.close()

#gets a nickname of a person from a specific team id
def getnick(name,teamid):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('SELECT nickname FROM members WHERE name = "%s" and id = "%d");' %(name, teamid))
    db.commit()
    db.close()
    
def changepass(username, password):
    password = encrypt(password)
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('UPDATE users SET password = "%s" WHERE username = "%s";' %(password, username))
    db.commit()
    db.close()

def addpermission(pieceid, username):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('INSERT INTO permissions VALUES("%d", "%s");' %(pieceid, username))
    db.commit()
    db.close()

def editnick(teamid,member,nickname):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('UPDATE members SET nickname = "%s" WHERE username = "%s" AND id = "%d";' %(nickname, username, id))
    db.commit()
    db.close()

def getteams(username):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('SELECT * FROM members WHERE username ="%s"')
    result = c.fetchall()
    db.commit()
    db.close()
    return result

def removepermission(user,pieceid):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    C.execute('DELETE * FROM permissions WHERE user = "%s" AND id = "%d"' %(user, id))
    db.commit()
    db.close()

def addform(pieceid, num, user, x, y, time, tag):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('INSERT INTO formations VALUES("%d", "%d", "%s", "%d", "%d", "%d", "%s");' %(pieceid, num, user, x, y, time, tag))
    db.commit()
    db.close()
