import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { faTrash, faPlus, faPenSquare } from '@fortawesome/free-solid-svg-icons';
import { AppServiceService } from '../../app-service.service';

@Component({
  selector: 'app-teacher-table',
  templateUrl: './teacher-table.component.html',
  styleUrls: ['./teacher-table.component.css']
})
export class TeacherTableComponent implements OnInit {

  faTrash = faTrash;
  faPlus = faPlus;
  faPenSquare = faPenSquare;
  teacherData: any[] = [];
  allTeachers: any[] = []; // backup for search reset
  selected: any;

  constructor(private service: AppServiceService, private router: Router) { }

  ngOnInit(): void {
    this.getTeacherData();
  }

  addNewTeacher() {
    this.router.navigate(['addTeacher'])
  }

  editTeacher(id: number) {
    const navigationExtras: NavigationExtras = {
      state: {
        id: id
      }
    };
    this.router.navigate(['editTeacher'], navigationExtras)
  }

  initializeDB() {
    this.service.initializeDB().subscribe((response) => {
      console.log('DB is Initialized')
    }, (error) => {
      console.log('ERROR - ', error)
    })
  }

  getTeacherData() {
    this.selected = 'Teachers';
    this.service.getTeacherData().subscribe((response) => {
      this.teacherData = Object.keys(response).map((key) => [response[key]]);
      this.allTeachers = [...this.teacherData]; // keep copy for searching
    }, (error) => {
      console.log('ERROR - ', error)
    })
  }

  getStudentData() {
    this.selected = 'Students';
    this.service.getStudentData().subscribe((response) => {
      this.teacherData = response;
      this.allTeachers = [...this.teacherData]; // backup students for searching
    }, (error) => {
      console.log('ERROR - ', error)
    })
  }

  search(value: string) {
    if (!value || value.trim().length === 0) {
      // Reset to full list if search input is empty
      this.teacherData = [...this.allTeachers];
    } else {
      const searchText = value.toLowerCase();
      this.teacherData = this.allTeachers.filter((teacher) =>
        teacher[0].name.toLowerCase().includes(searchText)
      );
    }
  }

  deleteTeacher(itemid: number) {
    const test = {
      id: itemid
    }
    this.service.deleteTeacher(test).subscribe((response) => {
      this.getTeacherData()
    })
  }
}
