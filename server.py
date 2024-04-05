from flask import *
import webbrowser
import sqlite3
import os
import smtplib
from email.message import EmailMessage

app = Flask(__name__)

conn = sqlite3.connect('./db/users.db')
cursor = conn.cursor()

cursor.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY, name TEXT, password TEXT, email TEXT, buys TEXT, balance TEXT)''')

conn.commit()
conn.close()

js_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'JavaScript')
css_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)),'css')
html_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'html')
db_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'db')
img1_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'img')
favicon_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'favicon')

@app.route('/favicon/<path:filename>')
def serve_favicon(filename):
    return send_from_directory(favicon_folder, filename)

@app.route('/img/<path:filename>')
def serve_img1(filename):
    return send_from_directory(img1_folder, filename)

@app.route('/JavaScript/<path:filename>')
def serve_js(filename):
    return send_from_directory(js_folder, filename)

@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory(css_folder, filename)

@app.route('/html/<path:filename>')
def serve_html(filename):
    return send_from_directory(html_folder, filename)

@app.route('/')
def index():
    return send_file(os.path.join(html_folder, 'index.html'))

@app.route('/db/<path:filename>')
def serve_db(filename):
    return send_from_directory(db_folder, filename)
    
def check_credentials(username, password):
    try:
        conn = sqlite3.connect('./db/users.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE name=? AND password=?", (username, password))
        user = cursor.fetchone()
        conn.close()
        return user is not None
    except Exception as e:
        print("Error:", e)
        return False

# ПРОВЕРКА ЕСТЬ ЛИ ТАКОЙ EMAIL
    
@app.route('/check_email_exists', methods=['POST'])
def check_email():
    data = request.get_json()
    email = data['email']
    if check_email_exists(email):
        return jsonify({'exists': True})
    else:
        return jsonify({'exists': False})

def check_email_exists(email):
    try:
        conn = sqlite3.connect('./db/users.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email=?", (email,))
        user = cursor.fetchone()
        conn.close()
        return user is not None
    except Exception as e:
        print("Error:", e)
        return False

# ЧЕКЕР ЛОГИНА, ЕСТЬ ЛИ ТАКОЙ ЮЗЕР
@app.route('/check_credentials', methods=['POST'])
def check_credentials_route():
    data = request.get_json()
    username = data['username']
    password = data['password']
    if check_credentials(username, password):
        return jsonify({'success': True})
    else:
        return jsonify({'success': False})


# ДОБАВЛЕНИЕ ПРИ РЕГЕ
def add_user(username, password, email):
    try:
        conn = sqlite3.connect('./db/users.db')
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (name, password, email, buys, balance) VALUES (?, ?, ?, ?, ?)",
                       (username, password, email, "0", "0"))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print("Error:", e)
        return False


# СМЕНА ПАРОЛЯ
@app.route('/change_password', methods=['POST'])
def change_password():
    data = request.get_json()
    username = data['username']
    new_password = data['password']
    
    try:
        conn = sqlite3.connect('./db/users.db')
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET password=? WHERE name=?", (new_password, username))
        conn.commit()
        conn.close()
        return jsonify({'success': True})
    except Exception as e:
        print("Error:", e)
        return jsonify({'success': False, 'message': str(e)})

# КНОПКА ЗАРЕГАТЬСЯ
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']
    email = data['email']
    if check_user_exists(username):
        return jsonify({'success': False, 'message': 'Пользователь с таким именем уже существует!'})
    else:
        if add_user(username, password, email):
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'message': 'Ошибка добавления пользователя в базу данных!'})


# ПРОВЕРКА ЕСТЬ ЛИ ТАКОЕ ИМЯ В БД
def check_user_exists(username):
    try:
        conn = sqlite3.connect('./db/users.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE name=?", (username,))
        user = cursor.fetchone()
        conn.close()
        return user is not None
    except Exception as e:
        print("Error:", e)
        return False

# ПРОВЕРКА НА ЮЗЕР НЕЙМ ПРИ РЕГЕ
@app.route('/check_username', methods=['POST'])
def check_username():
    data = request.get_json()
    username = data['username']
    if username_exists(username):
        return jsonify({'exists': True})
    else:
        return jsonify({'exists': False})

def username_exists(username):
    try:
        conn = sqlite3.connect('./db/users.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE name=?", (username,))
        user = cursor.fetchone()
        conn.close()
        return user is not None
    except Exception as e:
        print("Error:", e)
        return False

# ОТПРАВКА КОДА НА ПОЧТУ ДЛЯ ВЕРИФИКАЦИИ
@app.route('/send_verification_code', methods=['POST'])
def send_verification_code():
    data = request.get_json()
    email = data['email']
    verification_code = data['verificationCode']
    try:
        send_verification_email(email, verification_code)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

def send_verification_email(email, verification_code):
    msg = EmailMessage()
    msg.set_content(f"Ваш код для верификации: {verification_code}")

    msg['Subject'] = 'Verification Code' # ТЕМА СООБЩЕНИЯ
    msg['From'] = 'quickcast.hosting@mail.ru' # ОТПРАВИТЕЛЬ (ДОЛЖНО СОВПАДАТЬ С ЛОГИНОМ)
    msg['To'] = email

    with smtplib.SMTP('smtp.mail.ru', 587) as server: #СЕРВИС И ПОДКЛЮЧЕНИЕ
        server.starttls()
        server.login("quickcast.hosting@mail.ru", "6zdn0ksUsuhHjXbxALKZ")  #ОТПРАВИТЕЛЬ И ПАРОЛЬ ПРИЛОЖЕНИЯ
        server.send_message(msg)

# Обновление пароля с ЛК
@app.route('/update_password', methods=['POST'])
def update_password():
    data = request.get_json()
    username = data['username']
    new_password = data['new_password']
    
    try:
        update_password_in_database(username, new_password)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/update_user_password', methods=['POST'])
def update_user_password():
    data = request.get_json()
    username = data['username']
    new_password = data['new_password']
    
    try:
        update_password_in_database(username, new_password)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ОТПРАВКА КОДА НА ПОЧТУ ПРИ СБРОСЕ ПАРОЛЯ
@app.route('/send_forgote_code', methods=['POST'])
def send_forgote_code():
    data = request.get_json()
    username = data.get('username')
    forgot_code = data.get('ForgotCode')
    try:
        if not username:
            return jsonify({'success': False, 'message': 'Не указано имя пользователя.'}), 400
        if not forgot_code:
            return jsonify({'success': False, 'message': 'Не указан код сброса пароля.'}), 400

        user_email = get_user_email_by_username(username)
        if not user_email:
            return jsonify({'success': False, 'message': 'Пользователь с таким именем не найден.'}), 404

        send_forgote_email(user_email, forgot_code)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

# Получение email пользователя по имени
def get_user_email_by_username(username):
    try:
        conn = sqlite3.connect('./db/users.db')
        cursor = conn.cursor()
        cursor.execute("SELECT email FROM users WHERE name=?", (username,))
        user_email = cursor.fetchone()
        conn.close()
        return user_email[0] if user_email else None
    except Exception as e:
        print("Error:", e)
        return None

# ОТПРАВКА КОДА НА ПОЧТУ ПРИ СБРОСЕ ПАРОЛЯ
def send_forgote_email(email, forgot_code):  
    msg = EmailMessage()
    msg.set_content(f"Ваш код для сброса пароля: {forgot_code}") 

    msg['Subject'] = 'Password Reset Code'
    msg['From'] = 'quickcast.hosting@mail.ru'
    msg['To'] = email

    with smtplib.SMTP('smtp.mail.ru', 587) as server:
        server.starttls()
        server.login("quickcast.hosting@mail.ru", "6zdn0ksUsuhHjXbxALKZ")
        server.send_message(msg)


# Обновление пароля при Форготе
def update_password_in_database(username, new_password):
    conn = sqlite3.connect('./db/users.db')
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET password=? WHERE name=?", (new_password, username))
    conn.commit()
    conn.close()

# ОТПРАВКА КОДА НА ПОЧТУ ДЛЯ ЕЁ СМЕНЫ
@app.route('/send_change_code', methods=['POST'])
def send_change_code():
    data = request.get_json()
    email = data['email']
    change_code = data['ChangeCode']
    try:
        send_change_email(email, change_code)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})
    
def send_change_email(email, change_code):
    msg = EmailMessage()
    msg.set_content(f"Ваш код для смены почты {change_code}")

    msg['Subject'] = 'Change Email Code' # ТЕМА СООБЩЕНИЯ
    msg['From'] = 'quickcast.hosting@mail.ru' # ОТПРАВИТЕЛЬ (ДОЛЖНО СОВПАДАТЬ С ЛОГИНОМ)
    msg['To'] = email

    with smtplib.SMTP('smtp.mail.ru', 587)  as server: #СЕРВИС И ПОДКЛЮЧЕНИЕ
        server.starttls()
        server.login("quickcast.hosting@mail.ru", "6zdn0ksUsuhHjXbxALKZ")  #ОТПРАВИТЕЛЬ И ПАРОЛЬ ПРИЛОЖЕНИЯ
        server.send_message(msg)

# Смена email
@app.route('/change_email', methods=['POST'])
def change_email():
    data = request.get_json()
    username = data['username']
    new_email = data['email']
    
    try:
        conn = sqlite3.connect('./db/users.db')
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET email=? WHERE name=?", (new_email, username))
        conn.commit()
        conn.close()
        return jsonify({'success': True})
    except Exception as e:
        print("Error:", e)
        return jsonify({'success': False, 'message': str(e)})
    
# Получение email пользователя по имени
@app.route('/get_user_email', methods=['GET'])
def get_user_email():
    try:
        name = request.args.get('name')
        
        conn = sqlite3.connect('./db/users.db')
        cursor = conn.cursor()

        cursor.execute("SELECT email FROM users WHERE name=?", (name,))
        user_email = cursor.fetchone()
        
        conn.close()

        if user_email:
            return jsonify({'email': user_email[0]})
        else:
            return jsonify({'error': 'Пользователь не найден'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ПОЛУЧЕНИЮ ЮЗЕРОВ
@app.route('/get_user_data', methods=['GET'])
def get_user_data():
    try:
        name = request.args.get('name')
        
        conn = sqlite3.connect('./db/users.db')
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM users WHERE name=?", (name,))
        user_data = cursor.fetchone()
        
        conn.close()

        if user_data:
            user_info = {
                'name': user_data[1],
                'email': user_data[3],
                'buys': user_data[4],
                'balance': user_data[5]
            }
            return jsonify(user_info)
        else:
            return jsonify({'error': 'Пользователь не найден'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ПРОВЕРКА ИСПОЛЬЗОВАНИЯ EMAIL
@app.route('/check_email_usage', methods=['GET'])
def check_email_usage():
    try:
        email = request.args.get('email')
        
        conn = sqlite3.connect('./db/users.db')
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM users WHERE email=?", (email,))
        user_data = cursor.fetchone()
        
        conn.close()

        if user_data:
            return jsonify({'used': True})
        else:
            return jsonify({'used': False})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    if not os.getenv("WERKZEUG_RUN_MAIN"):  
        webbrowser.open_new_tab("http://localhost:8000")
    app.run(port=8000, debug=True)