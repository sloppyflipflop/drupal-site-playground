
<?php

/**
 * @file
 * Custom settings for the Site Theme.
 */

use Drupal\Core\Extension\ThemeSettingsProvider;
use Drupal\Core\Form\FormStateInterface;

/**
 * Implements hook_form_system_theme_settings_alter().
 */
function site_theme_form_system_theme_settings_alter(
  array &$form,
  FormStateInterface $form_state
): void {
  $settings = \Drupal::service(ThemeSettingsProvider::class);

  $form['site_identity'] = [
    '#type' => 'details',
    '#title' => t('Site identity'),
    '#open' => TRUE,
  ];

  $form['site_identity']['parent_organization'] = [
    '#type' => 'textfield',
    '#title' => t('Parent organization'),
    '#description' => t('Optional. Leave blank to display only the site name.'),
    '#default_value' => $settings->getSetting(
      'parent_organization',
      'site_theme'
    ) ?? '',
    '#maxlength' => 255,
  ];
}
