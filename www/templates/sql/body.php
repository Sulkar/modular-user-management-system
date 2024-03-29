<main class="flex-shrink-0">

    <div class="container mt-5">
        <div class="row text-center">
            <h1 class="mb-3">SQL Abfragen</h1>

        </div>
        <!-- SQL textarea -->
        <div class="row">
            <div class="col-md-12">
                <div id="loginForm" class="" style="">
                    <div class="row"><span>SQL Code:</span></div>
                    <div class="row">
                        <div class="col-md-12">
                            <a href="#" id="btnSqlAddColumn">Add Column</a> |
                            <a href="#" id="btnSqlRemoveColumn">Remove Column</a> |
                            <a href="#" id="btnSqlCreateTable">Create Table</a> |
                            <a href="#" id="btnSqlDeleteTable">Delete Table</a> |
                            <a href="#" id="btnSqlAlterColumn">Alter Column</a> |
                            <a href="#" id="btnSqlFindDuplicates">Find Duplicates</a>
                        </div>
                    </div>
                    <div class="form-group">
                        <textarea class="form-control" id="txtSQLData" rows="8">SELECT * FROM users</textarea>
                    </div>
                </div>
                <br>
                <button id="btnExecuteSQL" type="button" form="formUpdateEmail" class="btn btn-primary">SQL ausführen</button>
            </div>
        </div>

        <div id="loaderDIV"></div>

        <!-- SQL table area -->
        <div class="row">
            <div class="col-md-12">
                <table class="table" id="dataTable">
                </table>
            </div>
        </div>
    </div>
</main>