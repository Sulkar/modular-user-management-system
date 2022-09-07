<main class="flex-shrink-0" id="mainBody">

    <div class="container mt-5">
        <div class="row text-center">
            <h1 class="mb-3">Essensbestellung - <span id="klassenname">...</span></h1>

        </div>
        <div class="row text-center">
            <div class="col-md-4">
                <select class="form-select" id="selectEssenVerwaltenWoche" aria-label="Default select example">

                </select>
            </div>
            <div class="col-md-4">
                <span id="letzterBestelltag"></span>
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-success noPrint" id="btnDrucken">drucken</button>
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

<!-- Modal essen anzeigen -->
<div class="modal fade" id="modalEssenAnzeigen" tabindex="-1" aria-labelledby="modalEssenAnzeigenLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalEssenAnzeigen_Name">Essenname</h5>&nbsp;
                <a href="#" id="searchEssen"><span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>Google
                    </span>
                </a>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                <div id="essenAnzeigenForm" class="">

                    <p>(Typ: <span id="modalEssenAnzeigen_Typ"></span>)</p>
                    <p id="modalEssenAnzeigen_Beschreibung"></p>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>