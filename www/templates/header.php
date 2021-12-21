<?php
    // Initialize the session
    session_start();
    
    // Check if the user is already logged in, if yes then redirect him to welcome page
    if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true){
        //exit;
    }else{
        // Include login file
        require_once "./db/login.php";
    }

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SQLverine</title>
    <!-- CSS only -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <style>
        body {
            padding-top: 3.5rem;
        }

        .bd-placeholder-img {
            font-size: 1.125rem;
            text-anchor: middle;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
        }

        @media (min-width: 768px) {
            .bd-placeholder-img-lg {
                font-size: 3.5rem;
            }
        }
    </style>
</head>

<body>

    <nav class="navbar navbar-expand-md navbar-light fixed-top bg-light" style="background-color: white;">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                <!-- <img src="/images/SQLverine.svg" alt="My Site Logo" class="themedImage_1VuW themedImage--light_3UqQ navbar__logo"> -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 436.37 188.89" style="height: 2rem;">
                    <defs>
                        <style>
                            .cls-1 {
                                fill: #fffdfd;
                                stroke: #000;
                                stroke-linecap: round;
                                stroke-miterlimit: 10;
                                stroke-width: 4px;
                            }
                        </style>
                    </defs>
                    <g id="Ebene_2" data-name="Ebene 2">
                        <g id="Ebene_1-2" data-name="Ebene 1">
                            <path class="cls-1"
                                d="M277.93,148.43l68,37.6,48-3.2-29.6-18.4-29.6-19.2-2.4-24.8,14.4-16.8-5.6-9.6,13.6,23.2h28l29.6,11.2,21.6-8-8-28-30.4-41.6-50.4-12-39.2-20h-32L164.33,2l-28,6.4L12.33,86l-9.6,60,80-57.6,2.4-16.8-8,57.6L53.93,170l26.4,3.2,2.4-36.8,25.6,50.4,37.6-1.6-10.4-18.4h-14.4l-.8-18.4,60.8-24,91.2,3.2Q275.14,138,277.93,148.43Z" />
                            <path class="cls-1" d="M376.33,66l-2.4-11.2-14.4-3.2-4,12" />
                            <line class="cls-1" x1="268.47" y1="85.55" x2="272.33" y2="127.63" />
                        </g>
                    </g>
                </svg>

                <span style="font-weight: bold;">SQLverine<span>
            </a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
                aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav me-2 mb-2 mb-md-0">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="https://editor.sqlverine.org/">Editor</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="https://author.sqlverine.org/">Autorenwerkzeug</a>
                    </li>

                </ul>
                <form class="d-flex me-auto" style="margin:0;">

                    <div class="input-group me-2">
                        <input type="text" class="form-control" placeholder="Code" aria-label="Recipient's username"
                            aria-describedby="button-addon2" style="width:80px; height:30px">
                        <button class="btn btn-outline-secondary py-1" type="button" id="button-addon2"
                            style="height:30px;">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                style="width: 20px; vertical-align: top;" class="bi bi-search" viewBox="0 0 16 16">
                                <path
                                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                            </svg>
                        </button>
                    </div>

                </form>



                <ul class="navbar-nav me-2 mb-2 mb-md-0">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="#">Service</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Idee</a>
                    </li>
                    <li class="nav-item">
                        <?php if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true){ ?>
                            <a class="nav-link" id="btnProfil" href="#">Profil</a>
                        <?php } else { ?>
                        <a class="nav-link" id="btnLogin" href="#loginForm" role="button">
                            Anmelden
                        </a>
                        <?php } ?>
                    </li>


                </ul>

            </div>
        </div>
    </nav>

    <?php 
        if(!empty($login_err)){
            echo '<div class="alert alert-danger text-center my-0" role="alert" style="">' . $login_err . '</div>';
        }        
        ?>

    <!-- Login Form Popover -->
    <div id="loginForm" class="d-none" style="">
        <form class="form-inline text-center" role="form" action="<?php echo './'; ?>"
            method="post">
            <div class="form-group">
                <input placeholder="Benutzername" class="form-control mb-1" type="" name="username">
                <input placeholder="Passwort" class="form-control mb-1" minlength="6" type="password" name="password">
                <button type="submit" class="btn btn-primary" id="loginButton">Login</button>
            </div>
        </form>
    </div>
    <!-- Login Form Popover -->
    <div id="profilForm" class="d-none" style="">
        <form class="form-inline text-center" role="form" action="./db/logout.php" method="post">
            <div class="form-group">     
                <p><a href="#" id="uploadDbButton">Datenbank hochladen</a></p>  
                        
                <button type="submit"  class="btn btn-primary" id="logoutButton">Logout</button>
            </div>
        </form>
    </div>