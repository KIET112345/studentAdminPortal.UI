import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Student } from '../models/ui-models/student.model';
import { StudentService } from './student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'dateOfBirth', 'email', 'mobile', 'gender', 'edit'];
  dataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>();
  filterString: string = '';
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  @ViewChild(MatSort) matSortTest!: MatSort;

  constructor(private studentService: StudentService) {
  }

  ngOnInit(): void {
    // Fetch Students
    this.studentService.getStudents()
    .subscribe(
      (successRespone) => {
        this.students = successRespone;
        this.dataSource = new MatTableDataSource<Student>(this.students);

        if (this.matPaginator) {
          this.dataSource.paginator = this.matPaginator;
        }

        if (this.matSortTest) {
          this.dataSource.sort = this.matSortTest;
        }
      },
      (errorRespone) => {
        console.log(errorRespone);
      }
    );
  }
  filterStudents() {
    this.dataSource.filter = this.filterString.trim().toLocaleLowerCase();
  }
}
