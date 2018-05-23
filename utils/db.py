import sqlite3
import hashlib

#creates all the tables only if they do not exist
f = "app.db"
db = sqlite3.connect(f)
c = db.cursor()
c.execute('CREATE TABLE IF NOT EXISTS users (username STRING PRIMARY KEY, password STRING);')
c.execute('CREATE TABLE IF NOT EXISTS teams (name STRING, id INTEGER PRIMARY KEY);')
c.execute('CREATE TABLE IF NOT EXISTS members (id INTEGER, leader BIT,name STRING, nickname STRING);')
c.execute('CREATE TABLE IF NOT EXISTS permissions(id INTEGER, user STRING);')
c.execute('CREATE TABLE IF NOT EXISTS pieces(teamid INTEGER, pieceid INTEGER PRIMAY KEY, song STRING, path STRING, name STRING, length INTEGER, width INTEGER, rows INTEGER, columns INTEGER, privacy BIT);')
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
        c.execute('INSERT INTO users VALUES("%s", "%s");' %(user, password))
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
    number = 0
    c.execute('SELECT MAX(id) FROM teams;')
    result = c.fetchall()
    if result[0][0] != None:
        number = result[0][0] + 1
    c.execute('INSERT INTO teams VALUES("%s", "%d");' %(name, number))
    c.execute('INSERT INTO members VALUES("%d", 1, "%s", "%s");' %(number, name, nickname))
    db.commit()
    db.close()
    
def getname(teamid):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('SELECT name FROM teams WHERE id = "%d";' %(teamid))
    result = c.fetchall()
    db.commit()
    db.close()
    return result[0][0]

#adds a person to a team and adds a nickname
def addmember(teamid, name, nick):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('INSERT INTO members VALUES("%d", 0, "%s", "%s");' %(teamid, name, nick))
    db.commit()
    db.close()

#gets a nickname of a person from a specific team id
def getnick(teamid, name):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('SELECT nickname FROM members WHERE name = "%s" AND id = "%d";' %(name, teamid))
    result = c.fetchall()
    db.commit()
    db.close()
    return result[0][0]

#changes the password of a user
def changepass(username, password):
    password = encrypt(password)
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('UPDATE users SET password = "%s" WHERE username = "%s";' %(password, username))
    db.commit()
    db.close()

#allows a person to edit a piece
def addpermission(pieceid, username):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('INSERT INTO permissions VALUES("%d", "%s");' %(pieceid, username))
    db.commit()
    db.close()

#checks if a person has permission to a piece returns True/False
def checkpermission(pieceid, username):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('SELECT * FROM permissions WHERE id = "%d" AND user ="%s";' %(pieceid, username))
    result = c.fetchall()
    if result == []:
        db.close()
        return False
    else:
        db.close()
        return True
    
#changes the nickname of a member of a team  
def editnick(teamid,member,nickname):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('UPDATE members SET nickname = "%s" WHERE name = "%s" AND id = "%d";' %(nickname, member, teamid))
    db.commit()
    db.close()

#returns all the teams of a user   
def getteams(username):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('SELECT id FROM members WHERE name ="%s"')
    result = c.fetchall()
    db.commit()
    db.close()
    return result
print getteams("bob")
#removes a person's permission to edit a piece
def removepermission(user,pieceid):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    C.execute('DELETE * FROM permissions WHERE user = "%s" AND id = "%d"' %(user, id))
    db.commit()
    db.close()

# adds a formation    
def addform(pieceid, num, user, x, y, time, tag):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('INSERT INTO formations VALUES("%d", "%d", "%s", "%d", "%d", "%d", "%s");' %(pieceid, num, user, x, y, time, tag))
    db.commit()
    db.close()

#return all the pieces of a team
def getpieces(teamid):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('SELECT * FROM pieces WHERE teamid = "%d";' %(teamid))
    db.commit()
    db.close()
    result= c.fetchall()
    return result

# allows you to change the dancer, x and y cord, time and tag of a formation with its id and pieceid
def editform(pieceid, num, dancer, x, y, time, tag):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('UPDATE formations SET dancer = "%s", x = "%d", y = "%d", time ="%d", tag = "%s" WHERE id = "%d" AND formid = "%d" );' %(dancer, x, y, time, tag, pieceid))
    db.commit()
    db.close()

def delform(pieceid, num, dancer, x, y, time, tag):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('DELETE * WHERE dancer = "%s" AND x = "%d" AND y = "%d" AND time ="%d" AND tag = "%s" AND id = "%d" AND formid = "%d" );' %(dancer, x, y, time, tag, pieceid))
    db.commit()
    db.close()

def addpiece(teamid, pieceid, song, path, name, length, width, rows, columns, privacy):
    f = "app.db"
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('INSERT INTO pieces VALUES("%d", "%d","%s", "%s" , "%s", "%d", "%d", "%d", "%d", "%d");' %(teamid, pieceid, song, path, name, length, width, rows, columns, privacy) )
    db.commit()
    db.close()


