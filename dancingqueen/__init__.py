#importing flask submodules
from flask import Flask, render_template, redirect, url_for, session, flash, request, Response
#importing our own modules
from utils import db, auth
#importing os for urandom()
import os, json
from os import path

app = Flask(__name__)

DIR = path.dirname(__file__)

def make_secret_key():
    return os.urandom(32)

app.secret_key = make_secret_key()

app.jinja_env.globals.update(logged_in = auth.logged_in)


@app.route('/')
@app.route('/index')
@auth.in_session
def index():
    team_ids = db.getteams(auth.session['username'])
    teams = []
    for team_id in team_ids:
        teams.append( {"name":db.getname(team_id[0]), "id":team_id[0] })
    return render_template('home.html',
                           teams = teams)

#login: Login page. Renders login.html. Redirects to index after logging in.
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        #is this a valid username?
        if auth.user_exists(username):
            if auth.login(username, password):
                return redirect('index')
            else:
                flash('Login Error: You have entered the wrong password.')
        else:
            flash('Login Error: This username does not exist in the database. Check for any spelling errors or register a new account!')
    return render_template('login.html')

#logout: Logs the user out of the session. Redirects to index after logging out.
@app.route('/logout')
def logout():
    if auth.logged_in():
        auth.logout()
        flash('You have been logged out.')
    else:
        flash('Logout Error: You are not logged in.')
    return redirect('index')

#register: Registration page. Renders register.html. Redirects to login if successful. Error otherwise.
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if auth.new_user(username, password):
            flash('Account successfully created!')
            return redirect('login')
        else:
            flash('Registration error: Username is already in use.')
    return render_template('signin.html')

@app.route('/teams')
def teams():
    return render_template('teams.html')

@app.route('/create_team', methods=['GET', 'POST'])
@auth.in_session
def create_team():
    team_leader = auth.session['username']
    if request.method == 'POST':
        name = request.form.get('team_name')
        members = request.form.get('members').split()
        team_id = db.createteam(name, team_leader)
        for member in members:
            db.addmember(team_id, member)
    return render_template('create_team.html')

@app.route('/create_team.js')
def jsfile():
    data = []
    for i in db.get_users():
        data.append(i[0])
    return Response(render_template("create_team.js",
                                        data = json.dumps(data) ),
                        mimetype="text/javascript")

@app.route('/pieces', methods=["GET","POST"])
@auth.in_session
def pieces():
    if request.method == "POST":
        team_id = request.form.get('Submit')
        pieces_data = db.getpieces(int(team_id))
        pieces = []
        for piece in pieces_data:
            pieces.append({"team_id":piece[0], "piece_id":piece[1], "name":piece[2]})#didn't include rows and columns but its possible
    return render_template('pieces.html',
                           team_name = db.getname(int(team_id)),
                           team_id = team_id,
                           pieces = pieces)

@app.route('/create_piece', methods=["GET","POST"])
@auth.in_session
def create_piece():
    if request.method == 'POST':
        team_id = request.form.get('team_id')
        name = request.form.get('piece_name')
        columns = request.form.get('columns')
        rows = request.form.get('rows')
        if team_id != None and columns != None:
            db.addpiece(int(team_id), name, int(rows), int(columns))
    return render_template('create_piece.html', team_id = team_id)

@app.route('/view_piece', methods=["GET","POST"])
@auth.in_session
def view_piece():
    if request.method == 'POST':
        piece_name = request.form.get('p')
        team_id = request.form.get('piece_team')
        data = {'pieceName': piece_name,
                'stageSize':{
	            'length':10,
	            'width' :5,
                },
                "songInfo" :{
	            "songName"  :"abcSong",
	            "songLength":300,
                },
                'users' : [],
                'formations' : [
                    { 'timeTillNext': 1,
                      'userMovements':{},
                      'userTags' :{}
                    }
                ],
        }
        members = []
        for member in db.getmembers(int(team_id)):
            members.append({"username": member[0], "color": "blue"})
            data["formations"][0]["userMovements"][str(member[0])] = {"xcor":1,"ycor":1}
            data["formations"][0]["userTags"][str(member[0])] = ""
        data["users"] = members
    return render_template('view_pieces.html', data = json.dumps(data))

    
if __name__ == '__main__':
    app.debug = True
    app.run()
