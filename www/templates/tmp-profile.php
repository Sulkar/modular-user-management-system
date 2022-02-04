<main class="flex-shrink-0">

    <div class="container mt-5">
        <div class="row text-center">
            <div class="col">
                <h1 class="mb-3">Profile</h1>
            </div>

        </div>
        <div class="row">

            <div class="col-md-4">

            </div>

            <div class="col-md-4">

                <div class="card" style="">
                    <div class="text-center">
                        <img src="./images/avatar_placeholder.png" class="card-img-top" alt="..." style="max-width:15rem">
                    </div>

                    <div class="card-body">
                        <h5 class="card-title">Hello, <?php echo $username ?></h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            <span class="fw-bold">Username:</span><br> <?php echo $username ?>
                        </li>
                        <li class="list-group-item">
                            <span class="fw-bold">E-Mail:</span><br> <?php echo $email ?>
                            <a href="" data-bs-toggle="modal" data-bs-target="#modalUpdateEamil" style="float:right;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                </svg>
                                edit
                            </a>
                        </li>
                        <li class="list-group-item">
                            <span class="fw-bold">Password:</span><br> ****
                            <a href="" data-bs-toggle="modal" data-bs-target="#modalUpdatePassword" style="float:right;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                </svg>
                                edit
                            </a>
                        </li>
                    </ul>

                </div>
            </div>

            <div class="col-md-4">

            </div>
        </div>
    </div>
</main>


<!-- Modal update password -->
<div class="modal fade" id="modalUpdatePassword" tabindex="-1" aria-labelledby="modalUpdatePasswordLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalUpdatePasswordLabel">Change Password</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                <div id="loginForm" class="" style="">
                    <form id="formResetPassword" class="form-inline" role="form" action="./db/db_update_password.php" method="post">
                        <div class="form-group">
                            <label for="password1" class="form-label">New Password:</label>
                            <input id="password1" placeholder="Password" class="form-control mb-1" minlength="4" type="password" name="new_password">
                            <label for="password2" class="form-label">Confirm New Password:</label>
                            <input id="password2" placeholder="Password" class="form-control mb-1" minlength="4" type="password" name="confirm_password">

                        </div>
                    </form>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" form="formResetPassword" class="btn btn-primary">Update Password</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal change email -->
<div class="modal fade" id="modalUpdateEamil" tabindex="-1" aria-labelledby="modalUpdateEamilLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalUpdateEamilLabel">Change E-Mail</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                <div id="loginForm" class="" style="">
                    <form id="formUpdateEmail" class="form-inline" role="form" action="./db/db_profile_update.php" method="post">
                        <div class="form-group">
                            <label for="newEmail" class="form-label">New E-Mail:</label>
                            <input id="newEmail" placeholder="E-Mail" class="form-control mb-1" minlength="" type="" name="new_email">

                        </div>
                    </form>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" form="formUpdateEmail" class="btn btn-primary">Update Email</button>
            </div>
        </div>
    </div>
</div>