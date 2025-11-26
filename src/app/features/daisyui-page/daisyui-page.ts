import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CodeMockup } from "./code-mockup/code-mockup";
import { DataTable } from "./data-table/data-table";
import { ProductCard } from "./product-card/product-card";
import { ResponsiveShowcase } from "./responsive-showcase/responsive-showcase";

@Component({
  selector: 'app-daisyui-page-component',
  standalone: true,
  imports: [CommonModule, CodeMockup, DataTable, ProductCard, ResponsiveShowcase],
  templateUrl: './daisyui-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaisyuiPageComponent { }