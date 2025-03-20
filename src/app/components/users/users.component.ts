import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { AddEditUserComponent } from '../add-edit-user/add-edit-user.component';

@Component({
  selector: 'app-users',
  standalone : false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'createOn', 'actions'];
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private usersService: UsersService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.usersService.users$.subscribe(users => {
      this.dataSource.data = users;
  
      // Ensure paginator & sort are assigned only after data is available
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  

  openUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      data: user ? { ...user } : undefined
    });
    dialogRef.componentInstance.userSaved.subscribe(result => {
      if (result?.id) {
        this.usersService.editUser(result);
      }else {
        this.usersService.addUser(result);
      }
      dialogRef.close();
    })
  }

  onRowDoubleClick(user: User): void {
    this.openUserDialog(user);
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
}
