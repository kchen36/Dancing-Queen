import sqlite3
import hashlib
from os import path

f = path.dirname (__file__) + "/../data/app.db"
def createtables():
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('CREATE TABLE IF NOT EXISTS users (username STRING PRIMARY KEY, password STRING);')
    c.execute('CREATE TABLE IF NOT EXISTS teams (name STRING, id INTEGER PRIMARY KEY);')
    c.execute('CREATE TABLE IF NOT EXISTS members (id INTEGER, leader BIT,name STRING);')
    c.execute('CREATE TABLE IF NOT EXISTS permissions(id INTEGER, user STRING);')
    c.execute('CREATE TABLE IF NOT EXISTS pieces(teamid INTEGER, pieceid INTEGER PRIMARY KEY, name STRING, rows INTEGER, columns INTEGER);')
    c.execute('CREATE TABLE IF NOT EXISTS formations(id INTEGER,formid INTEGER, dancer STRING, x INTEGER, y INTEGER, time INTEGER, tag STRING);')
    db.close()

createtables()

#hash password
def encrypt(password):
    return hashlib.sha224(password).hexdigest()

#get all users
def get_users():
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('SELECT username FROM users;')
    result = c.fetchall()
    db.close()
    return result

#returns the password of a user if the username exist
def get_password(user):
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

#print get_password('Bob')

#adds user to users table and returns true if sucessful else returns false
#password encrypted in auth.py
def adduser(user, password):
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('SELECT * FROM users;')
    if c.fetchall() == []:
        c.execute('INSERT INTO users VALUES("%s", "%s");' %(user, password))
        db.commit()
        db.close()
        return True        
    if get_password(user) is None:
        c.execute('INSERT INTO users VALUES("%s", "%s");' %(user, password))
        db.commit()
        db.close()
        return True
    db.close()
    return False

#adduser('u', 'password')

#creates a team and the creator is the leader
def createteam(name,leader):
    db = sqlite3.connect(f)
    c = db.cursor()
    number = 0
    c.execute('SELECT MAX(id) FROM teams;')
    result = c.fetchall()
    if result[0][0] != None:
        number = result[0][0] + 1
    c.execute('INSERT INTO teams VALUES("%s", "%d");' %(name, number))
    c.execute('INSERT INTO members VALUES("%d", 1, "%s");' %(number, leader))
    db.commit()
    db.close()
    return number

def getteamid(name,leader):
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('SELECT id FROM teams WHERE name = "%s";' %(name) )
    results = c.fetchall()
    c.execute('SELECT id FROM members WHERE leader = 1 AND name = "%s";' %( leader))
    results2 = c.fetchall()
    for x in results:
        for y in results2:
            if x == y:
                return x[0][0]
    
def getname(teamid):
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('SELECT name FROM teams WHERE id = "%d";' %(teamid))
    result = c.fetchall()
    db.commit()
    db.close()
    return result[0][0]

#adds a person to a team
def addmember(teamid, name):
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('INSERT INTO members VALUES("%d", 0, "%s");' %(teamid, name))
    db.commit()
    db.close()

########### function no longer needed
#gets a nickname of a person from a specific team id
def getnick(teamid, name):
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
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('UPDATE users SET password = "%s" WHERE username = "%s";' %(password, username))
    db.commit()
    db.close()

#allows a person to edit a piece
def addpermission(pieceid, username):
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('INSERT INTO permissions VALUES("%d", "%s");' %(pieceid, username))
    db.commit()
    db.close()

#checks if a person has permission to a piece returns True/False
def checkpermission(pieceid, username):
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
########## function no longer needed    
#changes the nickname of a member of a team  
def editnick(teamid,member,nickname):
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('UPDATE members SET nickname = "%s" WHERE name = "%s" AND id = "%d";' %(nickname, member, teamid))
    db.commit()
    db.close()

#returns all the teams of a user   
def getteams(username):
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('SELECT id FROM members WHERE name ="%s"' %(username))
    result = c.fetchall()
    db.commit()
    db.close()
    for x in result:
        result
    return result

#removes a person's permission to edit a piece
def removepermission(pieceid,user):
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('DELETE FROM permissions WHERE user = "%s" AND id = "%d"' %(user, pieceid))
    db.commit()
    db.close()

# adds a formation    
def addform(pieceid, num, user, x, y, time, tag):
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('INSERT INTO formations VALUES("%d", "%d", "%s", "%d", "%d", "%d", "%s");' %(pieceid, num, user, x, y, time, tag))
    db.commit()
    db.close()

#return all the pieces of a team
def getpieces(teamid):
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('SELECT * FROM pieces WHERE teamid = "%d";' %(teamid))
    result = c.fetchall()
    db.commit()
    db.close()
    return result

# allows you to change the dancer, x and y cord, time and tag of a formation with its id and pieceid
def editform(pieceid, num, dancer, x, y, time, tag):
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('UPDATE formations SET dancer = "%s", x = "%d", y = "%d", time ="%d", tag = "%s" WHERE id = "%d" AND formid = "%d" ;' %(dancer, x, y, time, tag, pieceid, num))
    db.commit()
    db.close()

def delform(pieceid, num, dancer, x, y, time, tag):
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('DELETE FROM formations WHERE dancer = "%s" AND x = "%d" AND y = "%d" AND time ="%d" AND tag = "%s" AND id = "%d" AND formid = "%d" ;' %(dancer, x, y, time, tag, pieceid,num))
    db.commit()
    db.close()
    
def addpiece(teamid, name, rows, columns):
    db = sqlite3.connect(f)
    c = db.cursor()
    number = 0
    c.execute('SELECT MAX(pieceid) FROM pieces;')
    result = c.fetchall()
    if result[0][0] != None:
        number = result[0][0] + 1
    c.execute('INSERT INTO pieces VALUES("%d", "%d", "%s", "%d", "%d");' %(teamid, number, name, rows, columns ))
    db.commit()
    db.close()

def getform(pieceid):
    db = sqlite3.connect(f)
    c = db.cursor()
    c.execute('SELECT * FROM formations WHERE id = "%d";' %(pieceid))
    result = c.fetchall()
    db.close()
    return result

