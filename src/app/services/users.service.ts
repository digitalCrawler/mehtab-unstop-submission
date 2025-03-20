import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor() {
    this.loadUsers();
  }

  loadUsers(): void {
    const initialUsers: User[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', createOn: new Date() },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', createOn: new Date() },
    ];
    this.usersSubject.next(initialUsers);
  }

  addUser(user: User): void {
    const users = this.usersSubject.value;
    const newUser = { ...user, id: users.length + 1 , createdOn : new Date()}; // Assign unique ID
    this.usersSubject.next([...users, newUser]);
  }

  editUser(updatedUser: User): void {
    const users = this.usersSubject.value.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    );
    this.usersSubject.next(users);
  }

  deleteUser(userId: number): void {
    const users = this.usersSubject.value.filter(user => user.id !== userId);
    this.usersSubject.next(users);
  }
}
