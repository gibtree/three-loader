/**
 * This provides a generic way to switch between which custom attribute should be compared to the selected_cqa_id uniform.
 * Currently, this is not generic enough to commit upstream, might still need to be abstracted into a separate .vert file that the user passes in to be.
 */

export enum Selectable {
  REGION_ID = 1,
  INSTANCE_ID = 2,
  CQA_ID = 3,
}
