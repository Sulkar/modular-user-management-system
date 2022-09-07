<main class="flex-shrink-0">

    <div class="container mt-5">
        <div class="row text-center">
            <h1 class="mb-3">Data</h1>

        </div>
        <div class="row text-center">
            <div class="col-md-3">
                <select id="selectTables"></select>
            </div>
            <div class="col-md-3">
                <button type="button" class="btn btn-success cutLongText" id="btnImportData" data-bs-toggle="modal" data-bs-target="#modalImportData">Import Data</button>
            </div>
            <div class="col-md-3">
                <button type="button" class="btn btn-success cutLongText" id="btnMd5" data-bs-toggle="modal" data-bs-target="#modalMd5Data">MD5 Hash</button>
            </div>
            <div class="col-md-3">
                <button type="button" class="btn btn-success" id="btnSaveData">speichern</button>
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

<!-- Modal import data -->
<div class="modal fade" id="modalImportData" tabindex="-1" aria-labelledby="modalImportDataLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalImportDataLabel">Import Data</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                <div id="loginForm" class="" style="">
                    <form id="formUpdateEmail" class="form-inline" role="form" action="./db/db_profile_update.php" method="post">
                        <div class="form-group">
                            <label for="txtImportData" class="form-label">Columns:<br><span id="columnsSpan"></span></label>
                            <textarea class="form-control" id="txtImportData" rows="3"></textarea>

                        </div>
                    </form>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button id="btnImportDataModal" type="button" form="formUpdateEmail" class="btn btn-primary" data-bs-dismiss="modal">Import Data</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal MD5 data -->
<div class="modal fade" id="modalMd5Data" tabindex="-1" aria-labelledby="modalMd5DataLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalMd5DataLabel">Create MD5 Hash</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                <div class="form-group">
                    <label for="txtImportData" class="form-label">Normal string:<br></label>
                    <textarea class="form-control" id="txtMd5Normal" rows="3"></textarea>

                </div>
                <div class="form-group">
                    <label for="txtImportData" class="form-label">MD5 hash string:<br></label>
                    <textarea class="form-control" id="txtMd5Hash" rows="3"></textarea>

                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button id="btnCreateMd5Hash" type="button" form="formUpdateEmail" class="btn btn-primary">create MD5 hash</button>
            </div>
        </div>
    </div>
</div>