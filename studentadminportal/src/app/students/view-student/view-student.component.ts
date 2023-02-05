import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css'],
})
export class ViewStudentComponent implements OnInit {
  studentId: string | null | undefined;
  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: +84,
    genderId: '',
    gender: {
      id: '',
      description: '',
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: '',
    },
    profileImageUrl: '',
  };
  genderList: Gender[] = [];
  isNewStudent = false;
  header = '';
  displayProfileImageUrl = '';
  constructor(
    private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.studentId = params.get('id');

        if (this.studentId) {
          if (
            this.studentId?.toLocaleLowerCase() === 'Add'.toLocaleLowerCase()
          ) {
            // -->  new student functionality
            this.isNewStudent = true;
            this.header = 'Add New Student';
            this.setImage();
          } else {
            // existing student functionality
            this.isNewStudent = false;
            this.header = 'Edit Student';

            this.studentService.getStudent(this.studentId).subscribe(
              (successRespone) => {
                this.student = successRespone;
                this.setImage();
              },
              (errorRespone) => {
                console.log(errorRespone);
                this.setImage();
              }
            );
          }
        }
        this.genderService.getGenderList().subscribe((successRespone) => {
          var other = successRespone.splice(1,1);
          this.genderList = successRespone.concat(other[0]);
        });
      },
      (errorParams) => {
        console.log(errorParams);
      }
    );
  }
  onUpdateStudent(): void {
    // call student service to update the student
    this.studentService.updateStudent(this.student.id, this.student).subscribe(
      (successResponse) => {
        // show a notification
        this.snackbar.open('Student updated successfully', undefined, {
          duration: 2000,
        });
      },
      (errorResponse) => {
        // log it
      }
    );
  }

  onDelete(): void {
    this.studentService.deleteStudent(this.student.id).subscribe(
      (successResponse) => {
        this.snackbar.open('Student deleted successfully', undefined, {
          duration: 2000,
        });
        setTimeout(() => {
          this.router.navigateByUrl('students');
        }, 1500);
      },
      (errorResponse) => {
        // log it
      }
    );
  }
  onAdd(): void {
    this.studentService.addStudent(this.student).subscribe(
      (successResponse) => {
        this.snackbar.open('Add New Student successfully', undefined, {
          duration: 2000,
        });
        setTimeout(() => {
          this.router.navigateByUrl(`students/${this.student.id}`);
        }, 1500);
      },
      (errorResponse) => {
        // log it
      }
    );
  }

  uploadImage(event: any): void {
    console.log('uploadImage running');
    if (this.student.id) {
      const file: File = event.target.files[0];
      this.studentService.uploadImage(this.student.id, file).subscribe(
        (successResponse) => {
          this.student.profileImageUrl = successResponse;
          this.setImage();
          this.snackbar.open('Profile Image Updated', undefined, {
            duration: 2000,
          });
        },
        (errorRespone) => {

        }
      );
    }
  }

  private setImage(): void {
    if (this.student.profileImageUrl) {
      // fetch the image by url
      this.displayProfileImageUrl = this.studentService.getImagePath(this.student.profileImageUrl);
    } else {
      // display the default image
      this.displayProfileImageUrl = '/assets/images/user.png';
    }
  }

}
