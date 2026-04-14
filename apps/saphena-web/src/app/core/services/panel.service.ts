import {computed, inject, Injectable, signal} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private primaryState?: string;

  primaryRoute = signal<ActivatedRouteSnapshot | null>(null);
  panelRoute = signal<ActivatedRouteSnapshot | null>(null);

  constructor() {
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map(_ => this.activatedRoute)
      )
      .subscribe(route => {
        const primary = this.findChildRouteForOutlet(route, 'primary');
        const panel = this.findChildRouteForOutlet(route, 'panel');

        const primarySnapshot = this.findRouteLeaf(primary)!.snapshot || null;
        const panelSnapshot = this.findRouteLeaf(panel)?.snapshot || null;

        this.primaryRoute.set(primarySnapshot);
        this.panelRoute.set(panelSnapshot);

        const currentPrimaryState = this.getRouteId(primarySnapshot);
        if (currentPrimaryState != this.primaryState) {
          this.closePanel()
        }

        this.primaryState = currentPrimaryState;
      })
  }

  private findChildRouteForOutlet(route: ActivatedRoute, outlet: string) {
    const result = route.children.find(
      child => child.outlet === outlet
    );

    return result || null;
  }

  private findRouteLeaf(route: ActivatedRoute | null) {
    if (route === null) {
      return null;
    }
    let result = route;
    while (result.firstChild) {
      result = result.firstChild
    }
    return result;
  }

  private getRouteId(snapshot: ActivatedRouteSnapshot) {
   return snapshot.pathFromRoot
      .map((r) => r.url)
      .reduce((a, v) => a.concat(v), [])
      .map((s) => s.path)
      .toString();
  }

  public closePanel() {
    this.router.navigate([{ outlets: { panel: null } }], {
      replaceUrl: true
    });
  }
}
