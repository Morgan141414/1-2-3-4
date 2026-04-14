import {Component, input, output} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-tabs',
  imports: [
    NgClass
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  standalone: true
})

export class TabsComponent {
  tabs = input.required<ITab[]>();
  activeTab = input.required();
  changed = output<string>();
}

export interface ITab {
  id: string,
  title: string
}
