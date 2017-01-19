<?php
namespace Url;

interface RewriteRules
{
    public function getRules();

    public function getConditions();

    public function getPatterns();
}
