<main class="flex-shrink-0">

    <div class="container mt-5">
        <div class="row text-center">
            <h1 class="mb-3">Essen verwalten</h1>

        </div>
        <div class="row text-center">

            <div class="col-md-4">
                <button type="button" class="btn btn-success" id="btnCreateNewEssen" data-bs-toggle="modal" data-bs-target="#modalEssenAnlegen">Essen anlegen</button>
            </div>
            <div class="col-md-4">
                <button type="button" class="btn btn-success" id="btnSaveData">...</button>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <table class="table" id="dataTable">
                </table>
            </div>
        </div>
    </div>
</main>

<div id="loaderDIV"></div>

<!-- Modal essen anlegen -->
<div class="modal fade" id="modalEssenAnlegen" tabindex="-1" aria-labelledby="modalEssenAnlegenLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalEssenAnlegenLabel">Neues Essen anlegen</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                <div id="loginForm" class="" style="">
                    <form id="essenAnlegen" class="form-inline" role="form" action="./db/db_profile_update.php" method="post">


                        Name:
                        <input class="form-control" id="txtEssenName" value="Schnitzel mit Pommes" />
                        <br>
                        Tag:<br>
                        <input type="date" id="selectTag" name="tag">
                        <br><br>
                        Beschreibung:
                        <div id="summernote">Hello Summernote</div>

                    </form>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button id="btnNeuesEssenErstellen" type="button" form="formUpdateEmail" class="btn btn-primary" data-bs-dismiss="modal">Essen anlegen</button>
            </div>
        </div>
    </div>
</div>