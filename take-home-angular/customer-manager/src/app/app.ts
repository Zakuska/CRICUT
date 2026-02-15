import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef, GridOptions } from 'ag-grid-community'; // Column Definition Type Interface
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GridApi, AllCommunityModule, ModuleRegistry, CellValueChangedEvent } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AgGridAngular],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private gridApi!: GridApi;
  public quickFilterText: string = "";
  protected readonly title = signal('customer-manager');
  protected readonly version: string = "0.0.0";
  protected readonly angularVersion: string = "21.1.4";

  public rowData = [
//      { id: 1, customer: "John Smith", email: "a@b.c", phone: "(000)000-0000", address: "5050 s west", city: "somewhereville", state: "X", zip: "00000" },
//      { id: 2, customer: "Jane Doe", email: "a@b.c", phone: "(000)000-0000", address: "5050 s west", city: "somewhereville", state: "X", zip: "00000" },
//      { id: 3, customer: "Taho", email: "a@b.c", phone: "(000)000-0000", address: "5050 s west", city: "somewhereville", state: "X", zip: "00000" },
//      { id: 4, customer: "Corolla", email: "a@b.c", phone: "(000)000-0000", address: "5050 s west", city: "somewhereville", state: "X", zip: "00000" }
  ];

  // Column Definitions: Defines the columns to be displayed.
  public colDefs: ColDef[] = [
      { field: "id", width: 50 },
      { field: "customer", width: 150, flex: 1, editable: true },
      { field: "email", width: 150, editable: true },
      { field: "phone", width: 150, editable: true },
      { field: "address", width: 250, editable: true },
      { field: "city", width: 150, editable: true },
      { field: "state", width: 100, editable: true },
      { field: "zip", width: 100, editable: true },
      { headerName: "Action",
        width: 80,
        suppressNavigable: true, // Prevents keyboard navigation to the cell
        cellClass: 'no-border',
        cellRenderer: (params: any) => {
          // You can return a simple HTML string
          //if (params.value > 100) {
          //  return `<span style="color: green; font-weight: bold;">${params.value}</span>`;
          //} else {
          //  return `<span style="color: red;">${params.value}</span>`;
          // }
          // Alternatively, you can create and return a DOM element
          // const element = document.createElement('span');
          // element.textContent = params.value;
          // return element;
          //console.log(params);
          return `<span class="delete-icon" data-id="` + params.data.id + `">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" class="bi bi-trash" viewBox="0 0 16 16" id="Trash--Streamline-Bootstrap" height="16" width="16">
              <desc>
                Trash Streamline Icon: https://streamlinehq.com
              </desc>
              <path d="M5.5 5.5A0.5 0.5 0 0 1 6 6v6a0.5 0.5 0 0 1 -1 0V6a0.5 0.5 0 0 1 0.5 -0.5m2.5 0a0.5 0.5 0 0 1 0.5 0.5v6a0.5 0.5 0 0 1 -1 0V6a0.5 0.5 0 0 1 0.5 -0.5m3 0.5a0.5 0.5 0 0 0 -1 0v6a0.5 0.5 0 0 0 1 0z" stroke-width="1"></path>
              <path d="M14.5 3a1 1 0 0 1 -1 1H13v9a2 2 0 0 1 -2 2H5a2 2 0 0 1 -2 -2V4h-0.5a1 1 0 0 1 -1 -1V2a1 1 0 0 1 1 -1H6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1 -1V4.059L11.882 4zM2.5 3h11V2h-11z" stroke-width="1"></path>
            </svg>
            </span>          
          `;
        }
      },
  ];

   public gridOptions: GridOptions = {
    // Other options...
  };

  ngOnInit(): void {
    // Attempt to retrieve data from localStorage
    const savedData = localStorage.getItem('CustomerList');

    if (savedData) {
      try {
        // Parse the stringified data back into a JavaScript array
        this.rowData = JSON.parse(savedData);
      } catch (error) {
        console.error('Error parsing data from localStorage:', error);
        // Handle error (e.g., clear bad data, load defaults)
        localStorage.removeItem('CustomerList');
        this.loadDefaultData();
      }
    } else {
      // If no data in localStorage, load default or fetch from API
      this.loadDefaultData();
    }
  }
  
  private loadDefaultData(): void {
    this.rowData = [];
  }

  // Example of how to Persis data when edited
  onCellValueChanged(event: CellValueChangedEvent): void {
    
    //TODO: Flash Save LED

    console.log('Cell value changed:', event);
    
    // Access event data
    const oldValue = event.oldValue;
    const newValue = event.newValue;
    const data = event.data; // The row data
    const colId = event.column.getColId(); // The column ID

    console.log(`Old Value: ${oldValue}, New Value: ${newValue} for column: ${colId}`);

    // You can perform additional actions here, such as:
    // 1. Update the underlying data model (event.data is a reference to the row's data object).
    // 2. Make an API call to a backend service to persist the change.
    // 3. Update other cells in the grid, if needed, using the grid API.

    var allRowData: any[] = [];
    event.api.forEachNode(node => allRowData.push(node.data));

    localStorage.setItem('CustomerList', JSON.stringify(allRowData));
    console.log('Data updated in localstorage', event.data);
  }

  // Example of how to get all current row data via the API to save it
  onGridReady(params: any): void {
      // Access the grid api here if needed
      // To get all data: params.api.forEachNode(node => rowData.push(node.data));
      this.gridApi = params.api;
  }

  applyQuickFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.gridApi.setGridOption('quickFilterText', filterValue);
  }
  onQuickFilterChanged() {
    // Set the new quick filter text
    this.gridApi.setGridOption('quickFilterText', this.quickFilterText);
  }
}
