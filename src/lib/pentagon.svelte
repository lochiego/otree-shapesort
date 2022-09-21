<script lang="ts">
	import type { ShapeColor } from './types';

  export let size = 56;
  export let color: ShapeColor;
</script>

<svg class="icon" width={`${size}px`} height={`${size}px`}  viewBox="0 0 900 900" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
  <path id="inner" d="M450,0C605.732,77.736 755.921,186.854 877.975,310.942C852.168,483.074 794.801,659.631 714.503,814.058C542.822,842.705 357.178,842.705 185.497,814.058C105.199,659.631 47.832,483.074 22.025,310.942C144.079,186.854 294.268,77.736 450,0Z" style="--color: {color};"/>
  <path id="stroke" d="M450,0C605.732,77.736 755.921,186.854 877.975,310.942C852.168,483.074 794.801,659.631 714.503,814.058C542.822,842.705 357.178,842.705 185.497,814.058C105.199,659.631 47.832,483.074 22.025,310.942C144.079,186.854 294.268,77.736 450,0ZM450,56.125C585.445,126.67 715.65,221.27 824.597,328.286C799.359,478.901 749.626,631.967 681.514,768.652C530.471,791.192 369.529,791.192 218.486,768.652C150.374,631.967 100.641,478.901 75.403,328.286C184.35,221.27 314.555,126.67 450,56.125L450,56.125Z"/>
</svg>

<style>
  #inner {
    fill: var(--color);
  }

  #stroke {
    fill: rgba(0,0,0,0.4);
  }
</style>