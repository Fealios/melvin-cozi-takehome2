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

  private newLineRegex = /(\n)/;
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

    const lines = value.split(this.newLineRegex);
    console.log(lines);
    

    // console.log(this.fillVariableValues(lines));
  }

  private fillVariableValues(lines): string[] {
    let variableAndValue = {name: null, value: null};

    for (let i = 0; i<lines.length; i++) {
      if (this.varDeclarationRegex.test(lines[i])) {
        variableAndValue = this.getVariableNameAndValue(lines[i]);

        for (let j=0; j<lines.length; j++) {
          if (lines[j].includes(`@${variableAndValue.name}`)) {
            lines[j] = this.replaceWithValue(lines[j], variableAndValue);
          }
        }
      }
    }

    return lines;
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