<main class="flex-shrink-0">

    <div class="container mt-5">
        <div class="row text-center">
            <h1 class="mb-3">Essen bestellen für <span id="klassenname">...</span></h1>

        </div>
        <div class="row text-center">
            <div class="col-md-6">
                <select class="form-select" id="selectEssenVerwaltenWoche" aria-label="Default select example">

                </select>
            </div>
            <div class="col-md-6">
                <button type="button" class="btn btn-success" id="btnCreateNewEssen">...</button>
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

                <div id="essenAnlegenForm" class="" style="">
                    Name:
                    <input class="form-control" id="txtEssenName" value="" />
                    <br>
                    Tag:<br>
                    <input type="date" id="selectTag" name="tag">
                    <br><br>
                    Beschreibung:
                    <div id="summernote"></div>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button id="btnNeuesEssenErstellen" type="button" form="formUpdateEmail" class="btn btn-primary" data-bs-dismiss="modal">Essen anlegen</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal essen bearbeiten -->
<div class="modal fade" id="modalEssenBearbeiten" tabindex="-1" aria-labelledby="modalEssenBearbeitenLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalEssenBearbeitenLabel">Essen bearbeiten</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div id="essenBearbeitenForm" class="" style="">
                    Name:
                    <input class="form-control" id="txtEssenNameEdit" value="" />
                    <br>
                    Tag:<br>
                    <input type="date" id="selectTagEdit" name="tag">
                    <br><br>
                    Beschreibung:
                    <div id="summernoteEdit"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button id="btnEssenLoeschen" type="button" form="formUpdateEmail" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalEssenLoeschen">Essen löschen</button>
                <button id="btnEssenAendern" type="button" form="formUpdateEmail" class="btn btn-primary" data-bs-dismiss="modal">Essen ändern</button>

            </div>
        </div>
    </div>
</div>

<!-- Modal essen löschen bestätigen -->
<div class="modal fade" id="modalEssenLoeschen" tabindex="-1" aria-labelledby="modalEssenLoeschenLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalEssenLoeschenLabel">Essen löschen</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Wollen Sie wirklich das Essen <span></span> löschen?
            </div>
            <div class="modal-footer">

                <button id="btnEssenLoeschenJa" type="button" form="formUpdateEmail" class="btn btn-danger" data-bs-dismiss="modal">Ja</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Nein</button>
            </div>
        </div>
    </div>
</div>