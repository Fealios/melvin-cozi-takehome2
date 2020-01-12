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
  public message;

  private newLineRegex = /(\n)/; // separate message by returns and keep the return notation
  private varDeclarationRegex = new RegExp(/![a-z].*=/gi); // detect a variable declation in message

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
    /* 
      The core assumption of my entire app is predicated here.
      I am assuming that no one would paste a block of the parsed text in here
      and have something else on the same line as a variable declaration.  
      Because of this assumption I separate the messages by their lines based on returns,
      so that I might pick up the variable declarations and parse them through the rest of the block.  
      I am aware that I could use the exact same strategy, using RegEx to match a value and replace
      the segment with the variable, but I'm taking the example very literally in this case. 
    */
    
    const filled = this.fillVariableValues(lines.slice());
    // console.log(filled);
    
    this.message = this.clearVariablesFromMessage(filled).join('');
    console.log(this.message);
    
  }

  private fillVariableValues(lines): string[] {
    let variableAndValue = {name: null, value: null};

    for (let i = 0; i<lines.length; i++) {
      if (this.varDeclarationRegex.test(lines[i])) {
        variableAndValue = this.getVariableNameAndValue(lines[i]);

        for (let j=0; j<lines.length; j++) {
          if (lines[j].includes(`@${variableAndValue.name}`)) {
            lines[j] = this.replaceWithValue(lines[j], variableAndValue, false);
            j--
          } else if (lines[j].includes(`@{${variableAndValue.name}}`)) {
            lines[j] = this.replaceWithValue(lines[j], variableAndValue, true);
            j--
          }
        }
      }
    }

    return lines;
  }

  private replaceWithValue(line, variable, curly): string {
    if(curly) return line.replace(`@{${variable.name}}`, variable.value)
    else return line.replace(`@${variable.name}`, variable.value);
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

  private clearVariablesFromMessage(lines): string[] {
    const holder = []
    for (let i=0; i<lines.length; i++) {
      if (!this.varDeclarationRegex.test(lines[i])) {
        holder.push(lines[i]);
      }
    }
    return this.clearWhitespace(holder);
  }

  private clearWhitespace(lines): string[] {
    const holder = [];
    for (const line of lines) {
      if (line !== '""') {
        holder.push(line);
      }
    }
    return holder;
  }
}