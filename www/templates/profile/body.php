<main class="flex-shrink-0">

    <div class="container mt-5">
        <div class="row text-center">
            <div class="col">
                <h1 class="mb-3">Profile</h1>
            </div>

        </div>
        <div class="row mb-3">

            <div class="col-md-4">

            </div>

            <div class="col-md-4">

                <div class="card" style="">
                    <div class="text-center">
                        <img src="./images/avatar_placeholder.png" class="card-img-top" alt="..." style="max-width:15rem">
                    </div>

                    <div class="card-body">
                        <h5 class="card-title">Hello, <span id="profile_username1"></span></h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            <span class="fw-bold">Username:</span><br> <span id="profile_username2"></span>
                        </li>
                        <li class="list-group-item">
                            <span class="fw-bold">E-Mail:</span><br> <span id="profile_email"></span>
                            <a href="" data-bs-toggle="modal" data-bs-target="#modalUpdateEmail" style="float:right;">
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
                            <label for="newPassword" class="form-label">New Password:</label>
                            <input id="newPassword" placeholder="Password" class="form-control mb-1" minlength="4" type="password" name="new_password">
                            <label for="confirmPassword" class="form-label">Confirm New Password:</label>
                            <input id="confirmPassword" placeholder="Password" class="form-control mb-1" minlength="4" type="password" name="confirm_password">

                        </div>
                    </form>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button id="changePasswordButton" type="button" form="formResetPassword" class="btn btn-primary" data-bs-dismiss="modal">Update Password</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal change email -->
<div class="modal fade" id="modalUpdateEmail" tabindex="-1" aria-labelledby="modalUpdateEmailLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalUpdateEmailLabel">Change E-Mail</h5>
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
                <button id="updateEmail" type="button" form="formUpdateEmail" class="btn btn-primary" data-bs-dismiss="modal">Update Email</button>
            </div>
        </div>
    </div>
</div>