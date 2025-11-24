import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { CodeMockup } from './code-mockup/code-mockup';
import { ProductCard } from './product-card/product-card';
import { DataTable } from './data-table/data-table';
import { ResponsiveShowcase } from './responsive-showcase/responsive-showcase';

@Component({
  selector: 'app-daisyui-page',
  standalone: true,
  imports: [CommonModule, Navbar, Footer, CodeMockup, ProductCard, DataTable, ResponsiveShowcase],
  templateUrl: './daisyui-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaisyuiPageComponent {}