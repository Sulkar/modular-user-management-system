<main class="flex-shrink-0">

    <div class="container mt-5">
        <div class="row text-center">
            <h1 class="mb-3">Data</h1>

        </div>
        <div class="row text-center">
            <div class="col-md-4">
                <button type="button" class="btn btn-success" id="btnCreateDatabaseTable">Create Students Table</button>
            </div>
            <div class="col-md-4">
                <button type="button" class="btn btn-success" id="btnImportData" data-bs-toggle="modal" data-bs-target="#modalImportData">Import Data</button>
            </div>
            <div class="col-md-4">
                <button type="button" class="btn btn-success">...</button>
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
                            <label for="txtImportData" class="form-label">Import Data:</label>
                            <textarea class="form-control" id="txtImportData" rows="3">Richard, Müller, Germany, 1998-04-16</textarea>

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