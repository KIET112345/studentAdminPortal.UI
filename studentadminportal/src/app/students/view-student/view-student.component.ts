import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {
  studentId: string | null | undefined;
  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 1,
    genderId:'',
    gender: {
      id: '',
      description: ''
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: '',
    },
    profileImageUrl: '',
  };
  genderList: Gender[] = [];
  constructor(private readonly studentService: StudentService, private readonly route: ActivatedRoute, private readonly genderService: GenderService,
    private snackbar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.studentId = params.get("id");
        if (this.studentId) {
          this.studentService.getStudent(this.studentId).subscribe(
            (successRespone) => {
              console.log('get student successRespone ===>', successRespone)
              this.student = successRespone;
            },
            (errorRespone) => {
              console.log(errorRespone);
            }
          )
        }
      },
      (errorParams) => {
        console.log(errorParams)
      }
    )

    this.genderService.getGenderList().subscribe(
      (successRespone) => {
        console.log(successRespone)
        this.genderList = successRespone;
      }
    )
  }
  upDateStudent(): void {
    // call student service to update the student
    this.studentService.updateStudent(this.student.id, this.student)
    .subscribe((successResponse) => {
      console.log(successResponse);
      // show a notification
      this.snackbar.open('Student updated successfully', undefined, {
        duration: 2000
      })
    }, (errorResponse) => {
      // log it
    })
  }
}

