import { Component, OnInit } from '@angular/core';
import { AlertModel } from '../../../models/alert.model';
import { ChairModel } from '../../../models/chair.model';
import { CrudService } from '../../../services/crud.service';
import { MatDialog } from '@angular/material';
import { AddChairComponent } from 'src/app/components/main/add-chair/add-chair.component'
@Component({
  selector: 'app-chairs-list',
  templateUrl: './chairs-list.component.html',
  styleUrls: ['./chairs-list.component.css']
})
export class ChairsListComponent implements OnInit {

  public tableHeaders = {
    description: 'Description',
    owner: 'Owned by',
    location: 'Location'
  };

  // Temporal while Modal is implemented
  public data: ChairModel = {
    description: 'Silla 1',
    owner: 'Mariana',
    location: 'Ala 2'
  };
  public chairList: ChairModel[];
  public alert: AlertModel[];
  private collectionName = 'chairs';

  constructor(private crudService: CrudService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.getChairsList();
  }

  getChairsList() {
    this.crudService.getCollection(this.collectionName).subscribe(chairs => {
      // @ts-ignore
      this.chairList = chairs.map((e) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
    }, error => {
      this.alert = [{
        type: 'danger',
        message: 'Something went wrong: ' + error
      }];
    });
  }

  createChair() {
    const dialogRef = this.dialog.open(AddChairComponent, {
      width: '600px'
    });
    dialogRef.componentInstance.buttonText = 'Add chair';
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result !== false) {
        this.data.description = result.description ? result.description : '';
        this.data.location = result.location ? result.location : '';
        this.data.owner = result.owner ? result.owner : '';
        this.crudService.createDocument(this.collectionName, this.data)
        .then(() => {
          this.alert = [{
            type: 'success',
            message: 'Chair created successfully!'
          }];
        })
        .catch(error => {
          this.alert = [{
            type: 'danger',
            message: 'Something went wrong: ' + error
          }];
        });
      }
    });
  }

  deleteChair(chairId) {
    this.crudService.deleteDocument(this.collectionName, chairId)
      .then(() => {
        this.alert = [{
          type: 'success',
          message: 'Chair deleted successfully!'
        }];
      })
      .catch(error => {
        this.alert = [{
          type: 'danger',
          message: 'Something went wrong: ' + error
        }];
      });
  }
}
