<?php

namespace BrixLab\App;

class ClassManager
{

    public function renderHTML()
    {
        return '
        <li id="swiss-knife-lab" class="swk__item" style="display: none;">
            <span class="swk__label">SWK</span>            
        </li>


<div class="popup-bg">
    <div id="swk__class-manager-panel">
        <div class="swk__search-form">
            <h3>Search form</h3>
            <div class="swk__form-group">
                <label for="search_term" class="swk__label">Search Term:</label>
                <input type="text" id="search_term" name="search_term" required class="swk__input">
            </div>
            <div class="swk__form-group">
                <b class="swk__label">Search in Categories:</b>
                <div id="swk-class__category-filter" class="swk__radio-group">
                    <label class="swk__radio-label">
                        <input type="radio" name="search_category" value="all" required checked class="swk__radio"> All
                    </label>
                    <label class="swk__radio-label">
    <input type="radio" name="search_category" value="Uncategorized" class="swk__radio"> Uncategorized
</label>
                </div>
            </div>
            <div class="swk__form-group">
                <label for="replace_term" class="swk__label">Replace Term:</label>
                <input type="text" id="replace_term" name="replace_term" class="swk__input">
            </div>
            <div class="swk__form-group">
                <label for="prefix" class="swk__label">Add Prefix:</label>
                <input type="text" id="prefix" name="prefix" class="swk__input">
            </div>
            <div class="swk__form-group">
                <label for="suffix" class="swk__label">Add Suffix:</label>
                <input type="text" id="suffix" name="suffix" class="swk__input">
            </div>
            <button type="submit" class="swk__button">Update</button>
        </div>
        <div id="classes-list" class="swk__classes-list">

        </div>
        <div class="swk__add-new-class">
            <textarea class="swk__textarea"></textarea>
            <button class="swk__button">Add New Class</button>
        </div>
    </div>
</div>        
        ';
    }
}
