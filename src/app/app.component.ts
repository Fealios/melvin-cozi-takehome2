import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cozi2-takehome';

  public myForm;

  private newLineRegex = /\n/;
  private varDeclarationRegex = new RegExp(/![a-z].*=/gi);

  constructor(private fb: FormBuilder) {

  }

  ngOnInit() {
    this.myForm = this.fb.group({
      data: new FormControl(),
    })

  }

  public submitForm(): void {
    const { data: value } = this.myForm.value;

    let variableAndValue = {name: null, value: null};
    const lines = value.split(this.newLineRegex);

    let counter = 0;

    for (let i = 0; i<lines.length; i++) {
      if (counter > 160) return;
      if (lines[i].includes(this.varDeclarationRegex)) {
        variableAndValue = this.getVariableNameAndValue(lines[i]);
        for (let i=0; i<lines.length; i++) {
          counter++;
          if (lines[i].includes(`@${variableAndValue.name}`)) {
            lines[i] = this.replaceWithValue(lines[i], variableAndValue);
            i--;
          }
        }
      }
    }
  }

  private replaceWithValue(line, variable) {
    return line.replace(`@${variable.name}`, variable.value);
  }

  private getVariableNameAndValue(line: string): any {
    let split: string[] = line.split('=');
    const chars = split[0].split('');
    const varName = chars.slice(1, chars.length).join('');

    return {
      name: varName,
      value: split[1]
    }
  }
}

  // private replaceVariablesWithValues(lines, variablesAndValues) {
  //   let counter = 0;
  //   for (const variable of variablesAndValues) {
  //     for (let i = 0; i < lines.length; i++) {
  //       counter++;
  //       if (counter > 150) {
  //         return;
  //       } // this is for safety, protecting against infinite loops

  //       if (lines[i].includes(`@${variable.name}`)) {
  //         console.log('Before', lines[i]);
  //         const modified = lines[i].replace(`@${variable.name}`, variable.value);
  //         lines[i] = modified;
  //         console.log('After', modified);
          
  //         i--;
  //       }
  //     }
  //   }

  //   return lines;
  // }
