<?php

/**
 * Class Template - a very simple PHP class for rendering PHP templates
 */
class Template
{

	public $folder;

	function __construct($folder = null)
	{
		if ($folder) {
			$this->set_folder($folder);
		}
	}

	function set_folder($folder)
	{
		// normalize the internal folder value by removing any final slashes
		$this->folder = rtrim($folder, '/');
	}

	function render($suggestion, $variables = array())
	{
		$template = $this->find_template($suggestion);
		$output = '';
		if ($template) {
			$output = $this->render_template($template, $variables);
		}
		return $output;
	}

	function find_template($suggestion)
	{
		$found = false;
		$file = "{$this->folder}/{$suggestion}.php";
		if (file_exists($file)) {
			$found = $file;
		} else {
		}
		return $found;
	}

	function render_template($template, $variables)
	{
		ob_start();
		foreach ($variables as $key => $value) {
			${$key} = $value;
		}
		include $template;
		return ob_get_clean();
	}
}
