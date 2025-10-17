import os
import requests

def send_email_verification(to_email, token, name):
    resend_api_key = os.getenv("RESEND_API_KEY")
    if not resend_api_key:
        raise Exception("Falta RESEND_API_KEY en las variables de entorno")

    verification_link = f"https://payudaanimaljerez.onrender.com/verify?token={token}"

    subject = f"¡Bienvenido a Ayuda Animal Jerez, {name}!"
    body = f"""
Hola {name}!

Gracias por registrarte en nuestra plataforma 🐾.
Por favor confirma tu correo haciendo clic en el siguiente enlace:

{verification_link}

¡Esperamos que disfrutes de la experiencia!
"""

    payload = {
        "from": "Ayuda Animal Jerez <administracion@ayudaanimaljerez.es>",
        "to": [to_email],
        "subject": subject,
        "text": body,
        "html": f"<p>{body.replace(chr(10), '<br>')}</p>"
    }

    response = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {resend_api_key}",
            "Content-Type": "application/json"
        },
        json=payload
    )

    if response.status_code not in [200, 202]:
        raise Exception(f"Resend error: {response.status_code} - {response.text}")
