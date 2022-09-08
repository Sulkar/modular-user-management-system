<!DOCTYPE html>
<html lang="en" class="h-100">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Essensbestellung MSUSH</title>
    <!-- CSS only -->
    <link href="/css/bootstrap-5.2.0.min.css" rel="stylesheet">
    <link href="/css/summernote-lite.min.css" rel="stylesheet">

    <link href="/css/index.css" rel="stylesheet">
    <link href="/css/print.css" rel="stylesheet">
    <link href="<?php if (isset($page_css)) {
                    echo $page_css;
                } ?>" rel="stylesheet">
</head>

<body class="d-flex flex-column h-100">

    <nav class="navbar navbar-expand-md fixed-top navbar-light noPrint" style="background-color: white; border-bottom: 3px solid #198754;">
        <div class="container-fluid">


            <a class="navbar__brand" href="/">
                <div class="navbar__logo">
                    <img src="./images/msush.png" alt="Docusaurus Logo" height="32" width="32">
                </div>
                <div class="navbar__title fw-bold">
                    Essensbestellung MS USH
                </div>

            </a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarCollapse">
                <!-- Navbar left -->
                <ul class="navbar-nav me-2 mb-2 mb-md-0">

                    <!--  <li class="nav-item">
                        <a class="nav-link text-dark" aria-current="page" href="#">Page1</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-dark" href="#">Page2</a>
                    </li> -->

                </ul>
                <!-- search input -->
                <form class="d-flex me-auto" style="margin:0;">
                    <!--
                    <div class="input-group me-2">
                        <input type="text" class="form-control" placeholder="Code" aria-label="Recipient's username" aria-describedby="button-addon2" style="width:80px; height:30px">
                        <button class="btn btn-outline-secondary py-1" type="button" id="button-addon2" style="height:30px;">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" style="width: 20px; vertical-align: top;" class="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                            </svg>
                        </button>
                    </div>
                    -->
                </form>


                <!-- Navbar right -->
                <ul class="navbar-nav me-2 mb-2 mb-md-0">

                    <!-- user logged in -->
                    <?php if (isset($_SESSION["loggedIn"]) && $_SESSION["loggedIn"] === true && isset($_SESSION["role"])) { ?>

                        <!-- admin -->
                        <?php if (in_array($_SESSION["role"], array("admin"))) { ?>
                            <li class="nav-item">
                                <a class="nav-link text-dark" aria-current="page" href="./sql.php">SQL</a>
                            </li>

                            <li class="nav-item">
                                <a class="nav-link text-dark" aria-current="page" href="./data.php">Data</a>
                            </li>
                        <?php }  ?>

                        <!-- mensa -->
                        <?php if (in_array($_SESSION["role"], array("mensa", "admin"))) { ?>
                            <li class="nav-item">
                                <a class="nav-link text-dark" aria-current="page" href="./essen_uebersicht.php">Essen Übersicht</a>
                            </li>

                            <li class="nav-item">
                                <a class="nav-link text-dark" aria-current="page" href="./essen_verwalten.php">Essen verwalten</a>
                            </li>
                        <?php }  ?>

                        <!-- lehrer -->
                        <?php if (in_array($_SESSION["role"], array("lehrer", "admin"))) { ?>
                            <li class="nav-item">
                                <a class="nav-link text-dark" aria-current="page" href="./essen_bestellen.php">Essen bestellen</a>
                            </li>
                        <?php }  ?>


                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                                </svg>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" href="./profile.php">Profile</a></li>
                                <li><a class="dropdown-item" href="./db/db_logout.php">Logout</a></li>

                            </ul>
                        </li>
                        <!-- user NOT logged in -->
                    <?php } else { ?>

                        <li class="nav-item">
                            <a class="nav-link text-dark" id="btnLogin" href="/login.php" role="button">
                                Login
                            </a>
                        <?php } ?>
                        </li>


                </ul>

            </div>
        </div>

    </nav>
    <!-- alerts -->
    <div id="head_error" class="alert alert-danger text-center my-0 d-none" role="alert" style=""></div>
    <div id="head_success" class="alert alert-success text-center my-0 d-none" role="alert" style=""></div>