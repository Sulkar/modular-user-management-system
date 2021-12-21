

//popover login profil
const buttonLogin = document.getElementById('btnLogin');
const buttonProfil = document.getElementById('btnProfil');

if (buttonLogin != undefined) {
    const optionsButtonLogin = {};
    optionsButtonLogin.content = document.getElementById('loginForm').innerHTML;
    optionsButtonLogin.html = true;
    optionsButtonLogin.sanitize = false;
    new bootstrap.Popover(buttonLogin, optionsButtonLogin);
}else{
    const optionsButtonProfil = {};
    optionsButtonProfil.content = document.getElementById('profilForm').innerHTML;
    optionsButtonProfil.html = true;
    optionsButtonProfil.sanitize = false;
    new bootstrap.Popover(buttonProfil, optionsButtonProfil);
}